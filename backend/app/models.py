from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Ensure SQLite enforces foreign keys
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student") # admin, lecturer, student
    bio = db.Column(db.Text, nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    courses_taught = db.relationship("Course", back_populates="instructor", cascade="all, delete-orphan")
    enrollments = db.relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    lesson_progress = db.relationship("LessonProgress", back_populates="user", cascade="all, delete-orphan")
    submissions = db.relationship("AssignmentSubmission", foreign_keys="AssignmentSubmission.student_id", back_populates="student", cascade="all, delete-orphan")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "bio": self.bio or "",
            "avatar_url": self.avatar_url or "",
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    courses = db.relationship("Course", back_populates="category")

    def to_dict(self, include_count=False):
        data = {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description or "",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
        if include_count:
            data["course_count"] = len(self.courses)
        return data

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    objectives = db.Column(db.Text, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    level = db.Column(db.String(50), default="Beginner", nullable=False)
    is_published = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    category = db.relationship("Category", back_populates="courses")
    instructor = db.relationship("User", back_populates="courses_taught")
    modules = db.relationship("CourseModule", back_populates="course", cascade="all, delete-orphan", order_by="CourseModule.order_index")
    enrollments = db.relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    assignments = db.relationship("Assignment", back_populates="course", cascade="all, delete-orphan")

    def to_dict(self, include_curriculum=False, user_id=None):
        total_lessons = sum(len(m.lessons) for m in self.modules)
        data = {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "description": self.description,
            "objectives": self.objectives or "",
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else "Uncategorized",
            "instructor_id": self.instructor_id,
            "instructor_name": self.instructor.name if self.instructor else "Unknown",
            "instructor_bio": self.instructor.bio if self.instructor else "",
            "image_url": self.image_url or "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
            "level": self.level,
            "is_published": self.is_published,
            "total_modules": len(self.modules),
            "total_lessons": total_lessons,
            "enrolled_count": len(self.enrollments),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

        if include_curriculum:
            data["modules"] = [m.to_dict(include_lessons=True, user_id=user_id) for m in self.modules]
            data["assignments"] = [a.to_dict(user_id=user_id) for a in self.assignments]

        if user_id:
            enrollment = Enrollment.query.filter_by(course_id=self.id, user_id=user_id).first()
            data["is_enrolled"] = enrollment is not None
            if enrollment:
                data["enrolled_at"] = enrollment.enrolled_at.isoformat()
                # Compute progress
                if total_lessons > 0:
                    completed_count = LessonProgress.query.join(Lesson).join(CourseModule).filter(
                        CourseModule.course_id == self.id,
                        LessonProgress.user_id == user_id,
                        LessonProgress.is_completed == True
                    ).count()
                    data["progress_percentage"] = round((completed_count / total_lessons) * 100, 1)
                    data["completed_lessons"] = completed_count
                else:
                    data["progress_percentage"] = 0
                    data["completed_lessons"] = 0
            else:
                data["progress_percentage"] = 0
                data["completed_lessons"] = 0
        else:
            data["is_enrolled"] = False
            data["progress_percentage"] = 0
            data["completed_lessons"] = 0
        return data

class CourseModule(db.Model):
    __tablename__ = "course_modules"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    order_index = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    course = db.relationship("Course", back_populates="modules")
    lessons = db.relationship("Lesson", back_populates="module", cascade="all, delete-orphan", order_by="Lesson.order_index")

    def to_dict(self, include_lessons=True, user_id=None):
        data = {
            "id": self.id,
            "course_id": self.course_id,
            "title": self.title,
            "order_index": self.order_index,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
        if include_lessons:
            data["lessons"] = [l.to_dict(user_id=user_id) for l in self.lessons]
        return data

class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=True)
    video_url = db.Column(db.String(255), nullable=True)
    resource_url = db.Column(db.String(255), nullable=True)
    duration_minutes = db.Column(db.Integer, default=10, nullable=False)
    order_index = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    module = db.relationship("CourseModule", back_populates="lessons")
    progress_records = db.relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")

    def to_dict(self, user_id=None):
        data = {
            "id": self.id,
            "module_id": self.module_id,
            "title": self.title,
            "content": self.content or "",
            "video_url": self.video_url or "",
            "resource_url": self.resource_url or "",
            "duration_minutes": self.duration_minutes,
            "order_index": self.order_index,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
        if user_id:
            prog = LessonProgress.query.filter_by(lesson_id=self.id, user_id=user_id).first()
            data["is_completed"] = bool(prog and prog.is_completed)
        return data

class Enrollment(db.Model):
    __tablename__ = "enrollments"
    __table_args__ = (db.UniqueConstraint("user_id", "course_id", name="unique_user_course_enrollment"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="enrollments")
    course = db.relationship("Course", back_populates="enrollments")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "course_id": self.course_id,
            "enrolled_at": self.enrolled_at.isoformat() if self.enrolled_at else None
        }

class LessonProgress(db.Model):
    __tablename__ = "lesson_progress"
    __table_args__ = (db.UniqueConstraint("user_id", "lesson_id", name="unique_user_lesson_progress"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    is_completed = db.Column(db.Boolean, default=True, nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="lesson_progress")
    lesson = db.relationship("Lesson", back_populates="progress_records")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "lesson_id": self.lesson_id,
            "is_completed": self.is_completed,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }

class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    max_score = db.Column(db.Integer, default=100, nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    course = db.relationship("Course", back_populates="assignments")
    submissions = db.relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")

    def to_dict(self, user_id=None):
        data = {
            "id": self.id,
            "course_id": self.course_id,
            "course_title": self.course.title if self.course else "",
            "title": self.title,
            "description": self.description,
            "max_score": self.max_score,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "total_submissions": len(self.submissions),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
        if user_id:
            sub = AssignmentSubmission.query.filter_by(assignment_id=self.id, student_id=user_id).first()
            data["user_submission"] = sub.to_dict() if sub else None
        return data

class AssignmentSubmission(db.Model):
    __tablename__ = "assignment_submissions"
    __table_args__ = (db.UniqueConstraint("assignment_id", "student_id", name="unique_assignment_student_submission"),)

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    submission_text = db.Column(db.Text, nullable=False)
    score = db.Column(db.Float, nullable=True)
    feedback = db.Column(db.Text, nullable=True)
    graded_by = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    graded_at = db.Column(db.DateTime, nullable=True)

    assignment = db.relationship("Assignment", back_populates="submissions")
    student = db.relationship("User", foreign_keys=[student_id], back_populates="submissions")
    grader = db.relationship("User", foreign_keys=[graded_by])

    def to_dict(self):
        return {
            "id": self.id,
            "assignment_id": self.assignment_id,
            "assignment_title": self.assignment.title if self.assignment else "",
            "student_id": self.student_id,
            "student_name": self.student.name if self.student else "Unknown",
            "student_email": self.student.email if self.student else "",
            "submission_text": self.submission_text,
            "score": self.score,
            "feedback": self.feedback,
            "is_graded": self.score is not None,
            "graded_by_name": self.grader.name if self.grader else None,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "graded_at": self.graded_at.isoformat() if self.graded_at else None
        }
