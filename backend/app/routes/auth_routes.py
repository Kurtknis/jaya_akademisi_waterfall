from flask import Blueprint, request, jsonify, g
from ..models import db, User
from ..auth import generate_token, jwt_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "student").strip().lower()

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required."}), 400

    if role not in ["student", "lecturer"]:
        role = "student"

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists."}), 400

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

    token = generate_token(user)
    return jsonify({
        "message": "Registration successful.",
        "user": user.to_dict(),
        "token": token
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    if not user.is_active:
        return jsonify({"error": "Account is deactivated. Please contact an administrator."}), 403

    token = generate_token(user)
    return jsonify({
        "message": "Login successful.",
        "user": user.to_dict(),
        "token": token
    }), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required
def me():
    return jsonify({"user": g.current_user.to_dict()}), 200

@auth_bp.route("/profile", methods=["PUT"])
@jwt_required
def update_profile():
    data = request.get_json() or {}
    user = g.current_user
    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()
    if "bio" in data:
        user.bio = data["bio"].strip()
    if "avatar_url" in data:
        user.avatar_url = data["avatar_url"].strip()
    if "password" in data and data["password"]:
        user.set_password(data["password"])

    db.session.commit()
    return jsonify({
        "message": "Profile updated successfully.",
        "user": user.to_dict()
    }), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required
def logout():
    return jsonify({"message": "Logged out successfully."}), 200
