from datetime import datetime
from flask import Blueprint, request, jsonify, g
from ..models import db, Assignment, AssignmentSubmission, Course, Enrollment, User
from ..auth import jwt_required, role_required

assignment_bp = Blueprint("assignments", __name__)

@assignment_bp.route("/courses/<int:course_id>/assignments", methods=["GET"])
@jwt_required
def list_course_assignments(course_id):
    course = Course.query.get_or_404(course_id)
    assignments = Assignment.query.filter_by(course_id=course_id).order_by(Assignment.created_at.asc()).all()
    user_id = g.current_user.id
    return jsonify([a.to_dict(user_id=user_id) for a in assignments]), 200

@assignment_bp.route("/courses/<int:course_id>/assignments", methods=["POST"])
@role_required("lecturer", "admin")
def create_assignment(course_id):
    course = Course.query.get_or_404(course_id)
    if g.current_user.role != "admin" and course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden. Cannot add assignments to this course."}), 403

    data = request.get_json() or {}
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not title or not description:
        return jsonify({"error": "Title and description are required."}), 400

    due_date = None
    if data.get("due_date"):
        try:
            due_date = datetime.fromisoformat(data["due_date"].replace("Z", "+00:00"))
        except Exception:
            due_date = None

    assignment = Assignment(
        course_id=course_id,
        title=title,
        description=description,
        max_score=int(data.get("max_score", 100)),
        due_date=due_date
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify({"message": "Assignment created successfully.", "assignment": assignment.to_dict()}), 201

@assignment_bp.route("/assignments/<int:assignment_id>", methods=["GET"])
@jwt_required
def get_assignment(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)
    return jsonify(assignment.to_dict(user_id=g.current_user.id)), 200

@assignment_bp.route("/assignments/<int:assignment_id>", methods=["PUT"])
@role_required("lecturer", "admin")
def update_assignment(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)
    if g.current_user.role != "admin" and assignment.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    data = request.get_json() or {}
    if "title" in data and data["title"].strip():
        assignment.title = data["title"].strip()
    if "description" in data and data["description"].strip():
        assignment.description = data["description"].strip()
    if "max_score" in data:
        assignment.max_score = int(data["max_score"])
    if "due_date" in data:
        try:
            assignment.due_date = datetime.fromisoformat(data["due_date"].replace("Z", "+00:00")) if data["due_date"] else None
        except Exception:
            pass

    db.session.commit()
    return jsonify({"message": "Assignment updated successfully.", "assignment": assignment.to_dict()}), 200

@assignment_bp.route("/assignments/<int:assignment_id>", methods=["DELETE"])
@role_required("lecturer", "admin")
def delete_assignment(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)
    if g.current_user.role != "admin" and assignment.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    db.session.delete(assignment)
    db.session.commit()
    return jsonify({"message": "Assignment deleted successfully."}), 200

# Submissions
@assignment_bp.route("/assignments/<int:assignment_id>/submit", methods=["POST"])
@jwt_required
def submit_assignment(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)
    user = g.current_user

    data = request.get_json() or {}
    submission_text = data.get("submission_text", "").strip()
    if not submission_text:
        return jsonify({"error": "Submission text cannot be empty."}), 400

    submission = AssignmentSubmission.query.filter_by(assignment_id=assignment_id, student_id=user.id).first()
    if submission:
        submission.submission_text = submission_text
        submission.submitted_at = datetime.utcnow()
    else:
        submission = AssignmentSubmission(
            assignment_id=assignment_id,
            student_id=user.id,
            submission_text=submission_text
        )
        db.session.add(submission)

    db.session.commit()
    return jsonify({"message": "Assignment submitted successfully.", "submission": submission.to_dict()}), 200

@assignment_bp.route("/assignments/<int:assignment_id>/submissions", methods=["GET"])
@role_required("lecturer", "admin")
def list_submissions(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)
    if g.current_user.role != "admin" and assignment.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    submissions = AssignmentSubmission.query.filter_by(assignment_id=assignment_id).order_by(AssignmentSubmission.submitted_at.desc()).all()
    return jsonify({
        "assignment": assignment.to_dict(),
        "submissions": [s.to_dict() for s in submissions]
    }), 200

@assignment_bp.route("/submissions/<int:submission_id>/grade", methods=["PUT"])
@role_required("lecturer", "admin")
def grade_submission(submission_id):
    submission = AssignmentSubmission.query.get_or_404(submission_id)
    if g.current_user.role != "admin" and submission.assignment.course.instructor_id != g.current_user.id:
        return jsonify({"error": "Forbidden."}), 403

    data = request.get_json() or {}
    if "score" not in data or data["score"] is None:
        return jsonify({"error": "Score is required."}), 400

    score = float(data["score"])
    if score < 0 or score > submission.assignment.max_score:
        return jsonify({"error": f"Score must be between 0 and {submission.assignment.max_score}."}), 400

    submission.score = score
    submission.feedback = data.get("feedback", "").strip()
    submission.graded_by = g.current_user.id
    submission.graded_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Submission graded successfully.", "submission": submission.to_dict()}), 200

@assignment_bp.route("/student/grades", methods=["GET"])
@jwt_required
def get_student_grades():
    user = g.current_user
    submissions = AssignmentSubmission.query.filter_by(student_id=user.id).order_by(AssignmentSubmission.submitted_at.desc()).all()

    # Enrolled assignments that student hasn't submitted yet
    enrolled_courses = [e.course_id for e in Enrollment.query.filter_by(user_id=user.id).all()]
    all_assignments = Assignment.query.filter(Assignment.course_id.in_(enrolled_courses)).all() if enrolled_courses else []

    submitted_assignment_ids = {s.assignment_id for s in submissions}
    pending_assignments = [a.to_dict() for a in all_assignments if a.id not in submitted_assignment_ids]

    return jsonify({
        "submissions": [s.to_dict() for s in submissions],
        "pending_assignments": pending_assignments
    }), 200
