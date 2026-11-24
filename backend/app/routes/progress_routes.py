from datetime import datetime
from flask import Blueprint, request, jsonify, g
from ..models import db, Lesson, LessonProgress, Course, CourseModule
from ..auth import jwt_required

progress_bp = Blueprint("progress", __name__)

@progress_bp.route("/lessons/<int:lesson_id>/toggle-complete", methods=["POST"])
@jwt_required
def toggle_lesson_progress(lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    user = g.current_user

    progress = LessonProgress.query.filter_by(user_id=user.id, lesson_id=lesson_id).first()
    if progress:
        progress.is_completed = not progress.is_completed
        progress.completed_at = datetime.utcnow()
    else:
        progress = LessonProgress(user_id=user.id, lesson_id=lesson_id, is_completed=True)
        db.session.add(progress)

    db.session.commit()

    # Re-calculate overall course progress
    course_id = lesson.module.course_id
    total_lessons = Lesson.query.join(CourseModule).filter(CourseModule.course_id == course_id).count()
    completed_count = LessonProgress.query.join(Lesson).join(CourseModule).filter(
        CourseModule.course_id == course_id,
        LessonProgress.user_id == user.id,
        LessonProgress.is_completed == True
    ).count()

    percentage = round((completed_count / total_lessons * 100), 1) if total_lessons > 0 else 0

    return jsonify({
        "message": "Progress updated successfully.",
        "lesson_id": lesson_id,
        "is_completed": progress.is_completed,
        "course_progress": {
            "course_id": course_id,
            "total_lessons": total_lessons,
            "completed_lessons": completed_count,
            "percentage": percentage
        }
    }), 200

@progress_bp.route("/courses/<int:course_id>/progress", methods=["GET"])
@jwt_required
def get_course_progress(course_id):
    user = g.current_user
    total_lessons = Lesson.query.join(CourseModule).filter(CourseModule.course_id == course_id).count()
    progress_records = LessonProgress.query.join(Lesson).join(CourseModule).filter(
        CourseModule.course_id == course_id,
        LessonProgress.user_id == user.id,
        LessonProgress.is_completed == True
    ).all()

    completed_ids = [p.lesson_id for p in progress_records]
    completed_count = len(completed_ids)
    percentage = round((completed_count / total_lessons * 100), 1) if total_lessons > 0 else 0

    return jsonify({
        "course_id": course_id,
        "total_lessons": total_lessons,
        "completed_lessons": completed_count,
        "completed_lesson_ids": completed_ids,
        "percentage": percentage
    }), 200
