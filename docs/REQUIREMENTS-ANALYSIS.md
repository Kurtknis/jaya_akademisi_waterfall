# Requirements Analysis Document

## 1. Project Background
Universitas Pembangunan Jaya (UPJ) requires a streamlined Learning Management System (LMS) titled **Jaya Akademisi**. The system delivers modern self-paced and instructor-led online education with an experience inspired by platforms such as Coursera.

## 2. Stakeholders and User Roles
1. **Admin**: Platform supervisor managing master data, system stability, user accounts, and platform health.
2. **Lecturer**: Academic content creator managing syllabus, learning materials, modules, lesson items, assignments, and student grades.
3. **Student**: Undergraduate or general academic learner discovering courses, enrolling, accessing multi-modal study materials, submitting assignments, and monitoring progress.

## 3. Functional Requirements (FR)
- **FR-01 (Authentication & RBAC)**:
  - System shall provide secure user registration (for students).
  - System shall support email and password authentication with salted hashing.
  - System shall enforce role-based access control (Admin, Lecturer, Student) across protected endpoints and routes.
- **FR-02 (Course Management)**:
  - Lecturers and Admins shall create, update, list, and delete courses.
  - Each course belongs to a category and contains title, description, objectives, and cover image.
  - Lecturers can structure courses into modules and lessons.
- **FR-03 (Learning Delivery & Classroom)**:
  - Lessons support video streaming (YouTube / embed URLs), rich markdown/text lecture notes, and resource URLs (PDF / external references).
  - Students can navigate modules and lessons through an interactive classroom sidebar.
- **FR-04 (Enrollment & Progress Tracking)**:
  - Students can enroll in any available course with duplicate prevention.
  - Students can mark individual lessons as completed.
  - System dynamically computes completion percentage based on stored lesson completion records.
- **FR-05 (Assignment Lifecycle)**:
  - Lecturers can post assignments with due dates and maximum scores.
  - Enrolled students can submit text-based responses.
  - Lecturers can inspect submissions and assign numeric grades with written feedback.
- **FR-06 (Administrative Control & Metrics)**:
  - Admin dashboard displaying aggregate metrics: total students, total lecturers, total courses, and total enrollments.
  - Master category creation and course overview.
  - User status toggling (active / inactive).

## 4. Non-Functional Requirements (NFR)
- **NFR-01 (Portability & Local-First Execution)**: Operates entirely on standard localhost without external cloud dependencies or Docker.
- **NFR-02 (Database Simplicity & Persistence)**: Uses SQLite 3 (`backend/instance/jaya_akademisi.db`) with full transactional integrity and foreign key cascading.
- **NFR-03 (Performance)**: API response time under 100ms for typical local CRUD operations.
- **NFR-04 (Usability & Responsiveness)**: Clean, Coursera-inspired visual interface optimized for desktop and tablet screens.
