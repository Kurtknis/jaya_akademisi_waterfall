from flask import Blueprint, request, jsonify, g
from ..models import db, Course, CourseModule, Lesson
from ..auth import role_required

curriculum_bp = Blueprint("curriculum", __name__)

# Modules
@curriculum_bp.route("/courses/<int:course_id>/modules", methods=["POST"])
@role_required("lecturer", "admin")
def create_module(course_id):
    course = Course.query.get_or_404(course_id)
    if g.current_user.role != "admin" and course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden. Cannot add modules to another instructor's course."}), 403

    data = request.get_json() or {}
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Module title is required."}), 400

    order_index = data.get("order_index")
    if order_index is None:
        last_mod = CourseModule.query.filter_by(course_id=course_id).order_by(CourseModule.order_index.desc()).first()
        order_index = (last_mod.order_index + 1) if last_mod else 1

    module = CourseModule(course_id=course_id, title=title, order_index=order_index)
    db.session.add(module)
    db.session.commit()
    return jsonify({"message": "Module created successfully.", "module": module.to_dict(include_lessons=True)}), 201

@curriculum_bp.route("/modules/<int:module_id>", methods=["PUT"])
@role_required("lecturer", "admin")
def update_module(module_id):
    module = CourseModule.query.get_or_404(module_id)
    if g.current_user.role != "admin" and module.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    data = request.get_json() or {}
    if "title" in data and data["title"].strip():
        module.title = data["title"].strip()
    if "order_index" in data:
        module.order_index = int(data["order_index"])

    db.session.commit()
    return jsonify({"message": "Module updated successfully.", "module": module.to_dict(include_lessons=True)}), 200

@curriculum_bp.route("/modules/<int:module_id>", methods=["DELETE"])
@role_required("lecturer", "admin")
def delete_module(module_id):
    module = CourseModule.query.get_or_404(module_id)
    if g.current_user.role != "admin" and module.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    db.session.delete(module)
    db.session.commit()
    return jsonify({"message": "Module deleted successfully."}), 200

# Lessons
@curriculum_bp.route("/modules/<int:module_id>/lessons", methods=["POST"])
@role_required("lecturer", "admin")
def create_lesson(module_id):
    module = CourseModule.query.get_or_404(module_id)
    if g.current_user.role != "admin" and module.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    data = request.get_json() or {}
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Lesson title is required."}), 400

    order_index = data.get("order_index")
    if order_index is None:
        last_lesson = Lesson.query.filter_by(module_id=module_id).order_by(Lesson.order_index.desc()).first()
        order_index = (last_lesson.order_index + 1) if last_lesson else 1

    lesson = Lesson(
        module_id=module_id,
        title=title,
        content=data.get("content", ""),
        video_url=data.get("video_url", ""),
        resource_url=data.get("resource_url", ""),
        duration_minutes=int(data.get("duration_minutes", 10)),
        order_index=order_index
    )
    db.session.add(lesson)
    db.session.commit()
    return jsonify({"message": "Lesson created successfully.", "lesson": lesson.to_dict()}), 201

@curriculum_bp.route("/lessons/<int:lesson_id>", methods=["GET"])
def get_lesson(lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    current_user = g.get("current_user")
    user_id = current_user.id if current_user else None
    return jsonify(lesson.to_dict(user_id=user_id)), 200

@curriculum_bp.route("/lessons/<int:lesson_id>", methods=["PUT"])
@role_required("lecturer", "admin")
def update_lesson(lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    if g.current_user.role != "admin" and lesson.module.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    data = request.get_json() or {}
    if "title" in data and data["title"].strip():
        lesson.title = data["title"].strip()
    if "content" in data:
        lesson.content = data["content"]
    if "video_url" in data:
        lesson.video_url = data["video_url"]
    if "resource_url" in data:
        lesson.resource_url = data["resource_url"]
    if "duration_minutes" in data:
        lesson.duration_minutes = int(data["duration_minutes"])
    if "order_index" in data:
        lesson.order_index = int(data["order_index"])

    db.session.commit()
    return jsonify({"message": "Lesson updated successfully.", "lesson": lesson.to_dict()}), 200

@curriculum_bp.route("/lessons/<int:lesson_id>", methods=["DELETE"])
@role_required("lecturer", "admin")
def delete_lesson(lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    if g.current_user.role != "admin" and lesson.module.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    db.session.delete(lesson)
    db.session.commit()
    return jsonify({"message": "Lesson deleted successfully."}), 200
