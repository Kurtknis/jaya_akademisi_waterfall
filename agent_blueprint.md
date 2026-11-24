# AUTONOMOUS MASTER PROMPT
# JAYA AKADEMISI — UNIVERSITY LEARNING MANAGEMENT SYSTEM

You are an autonomous Full-Stack Developer, System Analyst, Database Engineer, UI/UX Designer, and QA Engineer.

Your mission is to BUILD, IMPLEMENT, TEST, AND COMPLETE a working university learning platform called **JAYA AKADEMISI**.

Do not just create a blueprint or explain how to build it.

I want the actual application implemented and running locally.

## 1. PROJECT OBJECTIVE

Build Jaya Akademisi, a simple university Learning Management System (LMS) inspired by Coursera and adapted for Universitas Pembangunan Jaya (UPJ).

This is an undergraduate academic project with a short deadline.

IMPORTANT PRIORITIES:

1. Application must run on localhost.
2. All core features must actually work.
3. Frontend and backend must communicate correctly.
4. Database must work.
5. UI must look professional.
6. Documentation must be available in Markdown.
7. Avoid unnecessary complexity.

Do not build an enterprise-level system.

Do not overengineer.

Do not waste time implementing advanced features that are unnecessary for an academic demonstration.

## 2. DEVELOPMENT METHODOLOGY

Use the WATERFALL methodology.

Follow these stages:

Phase 1: Requirements Analysis.

Phase 2: System Design.

Phase 3: Implementation.

Phase 4: Integration and Testing.

Phase 5: Deployment and Documentation.

IMPORTANT:

Execute all phases autonomously in sequence.

Do not stop after creating the blueprint.

Do not ask for approval between phases.

Continue working until the application is implemented and tested.

Document each phase in its own Markdown file.

## 3. TECHNOLOGY STACK

First inspect the existing repository.

If it is empty, use this stack:

Frontend:
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios

Backend:
- Python Flask
- Flask-SQLAlchemy
- Flask-CORS
- Flask-Bcrypt or Werkzeug password hashing

Database:
- PostgreSQL if it is already available and configured.
- Otherwise, SQLite as a reliable local fallback.

IMPORTANT:

Choose the simplest technology configuration that works in the current environment.

Do not waste time configuring complicated infrastructure.

Do not require Docker.

Do not require paid APIs.

Do not require external cloud services.

The entire application must be accessible through localhost.

## 4. USER ROLES

Implement three roles.

### ADMIN

- Login.
- View administrator dashboard.
- Manage students.
- Manage lecturers.
- Manage courses.
- Manage course categories.
- View platform statistics.

### LECTURER

- Login.
- View lecturer dashboard.
- Create courses.
- Edit courses.
- Delete courses.
- Add course modules.
- Add learning materials.
- Create assignments.
- View enrolled students.
- Review submissions.
- Give grades.

### STUDENT

- Register.
- Login.
- View student dashboard.
- Explore courses.
- Search courses.
- View course details.
- Enroll in courses.
- Access learning materials.
- Mark lessons as completed.
- Submit assignments.
- View grades.
- Track learning progress.

Implement simple backend role authorization.

## 5. CORE FEATURES

Build the following functional modules.

### A. Authentication

- Login.
- Registration.
- Logout.
- Password hashing.
- Role-based redirection.

### B. Dashboard

Admin dashboard:
- Total students.
- Total lecturers.
- Total courses.
- Total enrollments.

Lecturer dashboard:
- My courses.
- Total students.
- Assignments.
- Recent activity.

Student dashboard:
- Enrolled courses.
- Learning progress.
- Upcoming assignments.
- Recent activities.

### C. Course Catalog

Create a Coursera-inspired course discovery page.

Include:
- Course cards.
- Course title.
- Description.
- Instructor.
- Category.
- Course image or simple placeholder.
- Search functionality.
- Category filtering.
- Course detail page.

### D. Course Management

Lecturers can create and manage courses.

Each course should contain:
- Course information.
- Description.
- Learning objectives.
- Modules.
- Lessons.
- Learning resources.

### E. Enrollment

Students can enroll in courses.

Prevent duplicate enrollment.

Display enrolled courses in My Learning.

### F. Learning Classroom

Create a learning page with:

- Course sidebar.
- Module navigation.
- Lesson content.
- Video URL support.
- Text materials.
- PDF or external resource links.
- Mark as completed functionality.

### G. Assignments

Lecturers can create assignments.

Students can submit text answers.

Lecturers can review submissions and assign grades.

### H. Learning Progress

Display:
- Completed lessons.
- Total lessons.
- Completion percentage.
- Enrolled courses.

Progress must be calculated using actual database records.

## 6. DATABASE

Create a simple relational database.

Suggested tables:

- users
- courses
- categories
- course_modules
- lessons
- enrollments
- lesson_progress
- assignments
- assignment_submissions

Use SQLAlchemy models.

Implement:
- Primary keys.
- Foreign keys.
- Appropriate relationships.
- Unique enrollment constraints.
- Database initialization.
- Seed data.

Do not create unnecessary database entities.

## 7. UI/UX DESIGN

Create a modern academic LMS interface.

Brand name: JAYA AKADEMISI.

Visual direction:
- Professional.
- Clean.
- Minimalist.
- Modern university platform.
- Inspired by Coursera.

Use a consistent color palette inspired by academic institutional branding.

Suggested colors:
- Deep navy.
- White.
- Light gray.
- Blue accent.

Pages required:

1. Landing Page.
2. Login Page.
3. Registration Page.
4. Student Dashboard.
5. Lecturer Dashboard.
6. Admin Dashboard.
7. Course Catalog.
8. Course Detail.
9. My Learning.
10. Learning Classroom.
11. Assignment Management.
12. Grades.
13. User Management.

Create reusable components.

Make the application responsive.

Avoid excessive animations, unnecessary visual effects, and complicated layouts.

IMPORTANT:

Every button, navigation item, and form must have a meaningful working action.

Do not create decorative buttons that do nothing.

## 8. DOCUMENTATION

Create this documentation structure:

docs/
├── README.md
├── PROJECT-BLUEPRINT.md
├── WATERFALL-METHODOLOGY.md
├── REQUIREMENTS-ANALYSIS.md
├── SYSTEM-DESIGN.md
├── DATABASE-DESIGN.md
├── ERD.md
├── USE-CASE.md
├── DFD.md
├── API-DOCUMENTATION.md
├── TESTING-REPORT.md
├── DEPLOYMENT-GUIDE.md
│
└── phases/
    ├── PHASE-01-REQUIREMENTS.md
    ├── PHASE-02-SYSTEM-DESIGN.md
    ├── PHASE-03-IMPLEMENTATION.md
    ├── PHASE-04-TESTING.md
    └── PHASE-05-DEPLOYMENT.md

Every phase document must contain:
- Objective.
- Activities performed.
- Features developed.
- Files created or modified.
- Testing performed.
- Results.
- Completion status.

Use Mermaid diagrams for ERD, Use Case, and DFD where appropriate.

Documentation must reflect the actual implemented system.

Do not invent test results.

## 9. SEED DATA

Create realistic demonstration data.

Create these accounts:

Administrator:
Email: admin@jayaakademisi.local
Password: Admin123!

Lecturer:
Email: lecturer@jayaakademisi.local
Password: Lecturer123!

Student:
Email: student@jayaakademisi.local
Password: Student123!

Create at least:
- 3 sample courses.
- 3 course categories.
- 2 modules per course.
- 2 lessons per module.
- 2 assignments.
- Sample enrollment records.

All accounts must be created through the database seed script.

Document the credentials in README.md.

## 10. EXECUTION WORKFLOW

Follow this execution sequence:

STEP 1:
Inspect the current repository and environment.

STEP 2:
Create the project blueprint and Waterfall documentation.

STEP 3:
Implement the database and backend.

STEP 4:
Implement the frontend.

STEP 5:
Integrate frontend and backend.

STEP 6:
Create database migrations or initialization scripts and seed data.

STEP 7:
Run the application.

STEP 8:
Test the complete main user workflows.

STEP 9:
Fix errors discovered during testing.

STEP 10:
Update all Markdown documentation.

STEP 11:
Provide final localhost instructions.

You must continue autonomously until all steps are completed.

## 11. TESTING REQUIREMENTS

Verify the following:

- Backend starts successfully.
- Frontend starts successfully.
- Database initializes successfully.
- Login works.
- Registration works.
- Role-based dashboards work.
- Admin can manage users and courses.
- Lecturer can create courses.
- Student can browse courses.
- Student can enroll.
- Student can access lessons.
- Lesson completion works.
- Assignment submission works.
- Lecturer can grade submissions.
- Progress updates correctly.

Fix critical bugs before declaring completion.

Do not claim a feature works without testing it.

## 12. LOCALHOST REQUIREMENTS

The final project should use:

Frontend:
http://localhost:5173

Backend:
http://localhost:5000

Provide simple startup instructions.

Prefer a simple setup with separate frontend and backend terminal commands.

If practical, create a root-level startup script to make running the project easier.

Provide:
- Dependency installation commands.
- Database setup commands.
- Seed commands.
- Startup commands.
- Demo login credentials.

## 13. IMPORTANT DEVELOPMENT RULES

1. Do not stop at planning.
2. Do not ask for approval between phases.
3. Do not overengineer.
4. Do not introduce unnecessary libraries.
5. Do not rewrite existing working code without a reason.
6. Do not leave broken imports.
7. Do not leave placeholder pages for core features.
8. Do not create fake database operations.
9. Do not hardcode fake dashboard statistics.
10. Do not expose passwords or secrets in source code beyond documented local demo credentials.
11. Keep code readable and maintainable.
12. Prioritize a working application over visual perfection.
13. Test every major feature.
14. Update documentation continuously.

## 14. FINAL ACCEPTANCE CRITERIA

The project is complete when:

- Jaya Akademisi runs on localhost.
- Frontend and backend communicate.
- Database works.
- All three user roles can log in.
- Students can enroll and learn.
- Lecturers can manage courses and assignments.
- Administrators can manage the platform.
- Learning progress is functional.
- Documentation is complete.
- No critical runtime errors remain.

FINAL INSTRUCTION:

START WORKING NOW.

Inspect the repository, make reasonable technical decisions, build the entire application, test it, fix problems, and complete the documentation.

I do not need another proposal or theoretical explanation.

I need a working JAYA AKADEMISI LMS application ready for an academic demonstration tomorrow.