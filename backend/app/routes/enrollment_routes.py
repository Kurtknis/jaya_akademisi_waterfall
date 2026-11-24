from flask import Blueprint, request, jsonify, g
from ..models import db, Course, Enrollment, Lesson, CourseModule, LessonProgress
from ..auth import jwt_required

enrollment_bp = Blueprint("enrollments", __name__)

@enrollment_bp.route("/courses/<int:course_id>/enroll", methods=["POST"])
@jwt_required
def enroll_course(course_id):
    course = Course.query.get_or_404(course_id)
    user = g.current_user

    existing = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
    if existing:
        return jsonify({"message": "Already enrolled in this course.", "enrollment": existing.to_dict()}), 200

    enrollment = Enrollment(user_id=user.id, course_id=course_id)
    db.session.add(enrollment)
    db.session.commit()

    return jsonify({
        "message": f"Successfully enrolled in {course.title}.",
        "enrollment": enrollment.to_dict()
    }), 201

@enrollment_bp.route("/my", methods=["GET"])
@jwt_required
def get_my_courses():
    user = g.current_user
    enrollments = Enrollment.query.filter_by(user_id=user.id).order_by(Enrollment.enrolled_at.desc()).all()
    courses_data = []

    for enr in enrollments:
        c = enr.course
        if c:
            c_dict = c.to_dict(include_curriculum=False, user_id=user.id)
            c_dict["enrolled_at"] = enr.enrolled_at.isoformat()
            courses_data.append(c_dict)

    return jsonify(courses_data), 200

@enrollment_bp.route("/courses/<int:course_id>/unenroll", methods=["DELETE"])
@jwt_required
def unenroll_course(course_id):
    user = g.current_user
    enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
    if not enrollment:
        return jsonify({"error": "Enrollment record not found."}), 404

    # Remove progress records for this course lessons as well
    course_lessons = Lesson.query.join(CourseModule).filter(CourseModule.course_id == course_id).all()
    lesson_ids = [l.id for l in course_lessons]
    if lesson_ids:
        LessonProgress.query.filter(
            LessonProgress.user_id == user.id,
            LessonProgress.lesson_id.in_(lesson_ids)
        ).delete(synchronize_session=False)

    db.session.delete(enrollment)
    db.session.commit()
    return jsonify({"message": "Successfully unenrolled from course."}), 200
