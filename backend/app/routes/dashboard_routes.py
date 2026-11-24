from flask import Blueprint, jsonify, g
from ..models import db, User, Course, Category, Enrollment, Assignment, AssignmentSubmission, Lesson, LessonProgress
from ..auth import jwt_required

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required
def get_dashboard_stats():
    user = g.current_user

    if user.role == "admin":
        total_students = User.query.filter_by(role="student").count()
        total_lecturers = User.query.filter_by(role="lecturer").count()
        total_courses = Course.query.count()
        total_enrollments = Enrollment.query.count()

        recent_enrollments = Enrollment.query.order_by(Enrollment.enrolled_at.desc()).limit(5).all()
        recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()

        return jsonify({
            "role": "admin",
            "stats": {
                "total_students": total_students,
                "total_lecturers": total_lecturers,
                "total_courses": total_courses,
                "total_enrollments": total_enrollments
            },
            "recent_enrollments": [
                {
                    "id": e.id,
                    "student_name": e.user.name if e.user else "Unknown",
                    "course_title": e.course.title if e.course else "Unknown",
                    "enrolled_at": e.enrolled_at.isoformat()
                } for e in recent_enrollments
            ],
            "recent_users": [u.to_dict() for u in recent_users]
        }), 200

    elif user.role == "lecturer":
        my_courses = Course.query.filter_by(instructor_id=user.id).all()
        course_ids = [c.id for c in my_courses]

        total_students = db.session.query(Enrollment.user_id).filter(
            Enrollment.course_id.in_(course_ids)
        ).distinct().count() if course_ids else 0

        total_assignments = Assignment.query.filter(Assignment.course_id.in_(course_ids)).count() if course_ids else 0

        pending_grading = AssignmentSubmission.query.join(Assignment).filter(
            Assignment.course_id.in_(course_ids),
            AssignmentSubmission.score.is_(None)
        ).count() if course_ids else 0

        recent_submissions = AssignmentSubmission.query.join(Assignment).filter(
            Assignment.course_id.in_(course_ids)
        ).order_by(AssignmentSubmission.submitted_at.desc()).limit(5).all() if course_ids else []

        return jsonify({
            "role": "lecturer",
            "stats": {
                "total_courses": len(my_courses),
                "total_students": total_students,
                "total_assignments": total_assignments,
                "pending_grading": pending_grading
            },
            "my_courses": [c.to_dict(include_curriculum=False, user_id=user.id) for c in my_courses],
            "recent_submissions": [s.to_dict() for s in recent_submissions]
        }), 200

    else: # student
        enrollments = Enrollment.query.filter_by(user_id=user.id).order_by(Enrollment.enrolled_at.desc()).all()
        enrolled_course_ids = [e.course_id for e in enrollments]

        completed_courses = 0
        total_progress_sum = 0
        enrolled_courses_data = []

        for enr in enrollments:
            c = enr.course
            if c:
                c_data = c.to_dict(include_curriculum=False, user_id=user.id)
                prog = c_data.get("progress_percentage", 0)
                total_progress_sum += prog
                if prog >= 100:
                    completed_courses += 1
                enrolled_courses_data.append(c_data)

        avg_progress = round(total_progress_sum / len(enrollments), 1) if enrollments else 0

        # Upcoming assignments not yet submitted
        submitted_assignment_ids = [s.assignment_id for s in AssignmentSubmission.query.filter_by(student_id=user.id).all()]
        upcoming_assignments = Assignment.query.filter(
            Assignment.course_id.in_(enrolled_course_ids),
            ~Assignment.id.in_(submitted_assignment_ids) if submitted_assignment_ids else True
        ).order_by(Assignment.due_date.asc().nullslast()).limit(5).all() if enrolled_course_ids else []

        return jsonify({
            "role": "student",
            "stats": {
                "enrolled_courses": len(enrollments),
                "completed_courses": completed_courses,
                "average_progress": avg_progress,
                "pending_assignments": len(upcoming_assignments)
            },
            "enrolled_courses": enrolled_courses_data[:6],
            "upcoming_assignments": [a.to_dict(user_id=user.id) for a in upcoming_assignments]
        }), 200
