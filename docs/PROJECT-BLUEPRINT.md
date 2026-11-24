# Jaya Akademisi — Project Blueprint

## 1. Executive Summary
**Jaya Akademisi** is an intuitive, modern, Coursera-inspired University Learning Management System (LMS) engineered for **Universitas Pembangunan Jaya (UPJ)**. Built using the Waterfall software engineering methodology, the platform delivers academic delivery, student engagement, assignment management, and automated learning analytics within a lightweight, robust, and local-first architecture.

## 2. Core Architecture
- **Architecture Pattern**: Client-Server RESTful Architecture.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, Axios, React Router v6.
- **Backend**: Python 3.12, Flask, Flask-SQLAlchemy (ORM), Flask-CORS, Werkzeug Security, PyJWT.
- **Database**: SQLite 3 located at `backend/instance/jaya_akademisi.db`.
- **Target Network**: Localhost (Frontend: `http://localhost:5173`, Backend: `http://localhost:5000`).

## 3. User Roles and Capabilities
1. **Administrator (Admin)**:
   - System overview: total users, enrollments, active courses, statistics.
   - User administration: view, search, activate/deactivate accounts, role management.
   - Course catalog control: manage global categories and oversee course listings.
2. **Lecturer (Faculty)**:
   - Course authoring: create, edit, delete courses, syllabus, and objectives.
   - Curriculum builder: organize modules and lessons (video embed, lecture text, external resources).
   - Assignment management: create assignments, set deadlines, inspect student submissions, and award numerical scores with detailed feedback.
   - Student roster: view enrolled learners and monitor course performance.
3. **Student (Learner)**:
   - Registration and authentication.
   - Course discovery: search and filter courses across academic categories.
   - Course enrollment: one-click enrollment with duplicate prevention.
   - Interactive classroom: study modules sequentially, consume multimedia content, mark lessons completed.
   - Task completion: submit assignment responses.
   - Progress tracking: real-time percentage completion calculation stored in database.

## 4. Design Guidelines
- Academic institutional aesthetic: Deep Navy (`#0B2545`, `#0056D2`), Slate Gray (`#F8FAFC`, `#E2E8F0`), and clean typography.
- High usability: clear calls to action, responsive layouts, intuitive dashboards, and instant feedback.
- Integrity: complete data persistence in SQLite with relational foreign key enforcement.
