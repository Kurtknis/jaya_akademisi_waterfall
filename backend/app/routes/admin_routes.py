import re
from flask import Blueprint, request, jsonify, g
from ..models import db, User, Category, Course
from ..auth import role_required

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/users", methods=["GET"])
@role_required("admin")
def list_users():
    role = request.args.get("role")
    search = request.args.get("search", "").strip()

    query = User.query
    if role:
        query = query.filter_by(role=role)
    if search:
        query = query.filter(
            db.or_(
                User.name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )

    users = query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200

@admin_bp.route("/users", methods=["POST"])
@role_required("admin")
def create_user():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "student").strip().lower()

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required."}), 400

    if role not in ["admin", "lecturer", "student"]:
        return jsonify({"error": "Invalid role specified."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email is already registered."}), 400

    user = User(
        name=name,
        email=email,
        role=role,
        bio=data.get("bio", ""),
        avatar_url=data.get("avatar_url", "")
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully.", "user": user.to_dict()}), 201

@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
@role_required("admin")
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()
    if "role" in data and data["role"] in ["admin", "lecturer", "student"]:
        user.role = data["role"]
    if "is_active" in data:
        user.is_active = bool(data["is_active"])
    if "bio" in data:
        user.bio = data["bio"].strip()
    if "password" in data and data["password"]:
        user.set_password(data["password"])

    db.session.commit()
    return jsonify({"message": "User updated successfully.", "user": user.to_dict()}), 200

@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@role_required("admin")
def delete_user(user_id):
    if user_id == g.current_user.id:
        return jsonify({"error": "Cannot delete your own administrator account."}), 400

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully."}), 200

# Category Management
@admin_bp.route("/categories", methods=["POST"])
@role_required("admin")
def create_category():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "Category name is required."}), 400

    slug = re.sub(r"[^\w\s-]", "", name.lower())
    slug = re.sub(r"[\s_-]+", "-", slug).strip("-")

    if Category.query.filter(db.or_(Category.name == name, Category.slug == slug)).first():
        return jsonify({"error": "Category name or slug already exists."}), 400

    category = Category(
        name=name,
        slug=slug,
        description=data.get("description", "")
    )
    db.session.add(category)
    db.session.commit()
    return jsonify({"message": "Category created successfully.", "category": category.to_dict(include_count=True)}), 201

@admin_bp.route("/categories/<int:category_id>", methods=["PUT"])
@role_required("admin")
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json() or {}

    if "name" in data and data["name"].strip():
        category.name = data["name"].strip()
        slug = re.sub(r"[^\w\s-]", "", category.name.lower())
        category.slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
    if "description" in data:
        category.description = data["description"]

    db.session.commit()
    return jsonify({"message": "Category updated successfully.", "category": category.to_dict(include_count=True)}), 200

@admin_bp.route("/categories/<int:category_id>", methods=["DELETE"])
@role_required("admin")
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    if category.courses:
        return jsonify({"error": "Cannot delete category with associated courses. Reassign courses first."}), 400

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted successfully."}), 200
