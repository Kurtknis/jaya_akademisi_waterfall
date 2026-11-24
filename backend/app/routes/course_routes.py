import re
from flask import Blueprint, request, jsonify, g
from ..models import db, Course, Category, User, Enrollment
from ..auth import role_required, get_current_user_from_header

course_bp = Blueprint("courses", __name__)

def generate_slug(title: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", title.lower())
    slug = re.sub(r"[\s_-]+", "-", slug).strip("-")
    base_slug = slug
    counter = 1
    while Course.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug

@course_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    return jsonify([c.to_dict(include_count=True) for c in categories]), 200

@course_bp.route("", methods=["GET"])
def list_courses():
    search = request.args.get("search", "").strip()
    category_id = request.args.get("category_id")
    category_slug = request.args.get("category")
    level = request.args.get("level")
    instructor_id = request.args.get("instructor_id")
    my_courses_only = request.args.get("my_courses") == "true"

    current_user = get_current_user_from_header()
    query = Course.query

    # If lecturer is querying their own courses
    if my_courses_only and current_user and current_user.role in ["lecturer", "admin"]:
        query = query.filter_by(instructor_id=current_user.id)
    elif not (current_user and current_user.role in ["lecturer", "admin"]):
        query = query.filter_by(is_published=True)

    if search:
        query = query.filter(
            db.or_(
                Course.title.ilike(f"%{search}%"),
                Course.description.ilike(f"%{search}%")
            )
        )
    if category_id:
        query = query.filter_by(category_id=int(category_id))
    elif category_slug:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter_by(category_id=cat.id)
    if level:
        query = query.filter_by(level=level)
    if instructor_id:
        query = query.filter_by(instructor_id=int(instructor_id))

    courses = query.order_by(Course.created_at.desc()).all()
    user_id = current_user.id if current_user else None
    return jsonify([c.to_dict(include_curriculum=False, user_id=user_id) for c in courses]), 200

@course_bp.route("/<identifier>", methods=["GET"])
def get_course_detail(identifier):
    current_user = get_current_user_from_header()
    user_id = current_user.id if current_user else None

    if identifier.isdigit():
        course = Course.query.get(int(identifier))
    else:
        course = Course.query.filter_by(slug=identifier).first()

    if not course:
        return jsonify({"error": "Course not found."}), 404

    # Non-admin / non-instructor cannot view unpublished courses unless enrolled
    if not course.is_published:
        if not (current_user and (current_user.role == "admin" or current_user.id == course.instructor_id)):
            return jsonify({"error": "Course is not published."}), 404

    return jsonify(course.to_dict(include_curriculum=True, user_id=user_id)), 200

@course_bp.route("", methods=["POST"])
@role_required("lecturer", "admin")
def create_course():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    category_id = data.get("category_id")

    if not title or not description or not category_id:
        return jsonify({"error": "Title, description, and category_id are required."}), 400

    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Invalid category."}), 400

    slug = generate_slug(title)
    course = Course(
        title=title,
        slug=slug,
        description=description,
        objectives=data.get("objectives", ""),
        category_id=category_id,
        instructor_id=g.current_user.id,
        image_url=data.get("image_url") or "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
        level=data.get("level", "Beginner"),
        is_published=data.get("is_published", True)
    )
    db.session.add(course)
    db.session.commit()

    return jsonify({
        "message": "Course created successfully.",
        "course": course.to_dict(include_curriculum=True, user_id=g.current_user.id)
    }), 201

@course_bp.route("/<int:course_id>", methods=["PUT"])
@role_required("lecturer", "admin")
def update_course(course_id):
    course = Course.query.get_or_404(course_id)
    if g.current_user.role != "admin" and course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden. You can only edit your own courses."}), 403

    data = request.get_json() or {}
    if "title" in data and data["title"].strip():
        course.title = data["title"].strip()
    if "description" in data and data["description"].strip():
        course.description = data["description"].strip()
    if "objectives" in data:
        course.objectives = data["objectives"]
    if "category_id" in data:
        course.category_id = int(data["category_id"])
    if "image_url" in data:
        course.image_url = data["image_url"]
    if "level" in data:
        course.level = data["level"]
    if "is_published" in data:
        course.is_published = bool(data["is_published"])

    db.session.commit()
    return jsonify({
        "message": "Course updated successfully.",
        "course": course.to_dict(include_curriculum=True, user_id=g.current_user.id)
    }), 200

@course_bp.route("/<int:course_id>", methods=["DELETE"])
@role_required("lecturer", "admin")
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    if g.current_user.role != "admin" and course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden. You can only delete your own courses."}), 403

    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted successfully."}), 200
