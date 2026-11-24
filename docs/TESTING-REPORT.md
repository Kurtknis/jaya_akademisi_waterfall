# Testing Report

## 1. Test Overview
Comprehensive integration and end-to-end (E2E) verification was executed on the Jaya Akademisi LMS application on localhost.

- **Test Suite 1**: Backend API Unit & Integration (`backend/test_api.py`)
- **Test Suite 2**: Complete User Workflow & Lifecycle (`backend/test_e2e_workflows.py`)
- **Test Suite 3**: Frontend Build & Bundle Verification (`npm --prefix frontend run build`)

## 2. Test Execution Results

| Test ID | Test Scenario | Expected Outcome | Actual Outcome | Status |
|---|---|---|---|---|
| TC-01 | Health Check (`/api/health`) | HTTP 200 OK with service meta | HTTP 200 OK | **PASSED** |
| TC-02 | Admin Login (`admin@jayaakademisi.local`) | Returns valid JWT token & role `admin` | HTTP 200 OK | **PASSED** |
| TC-03 | Lecturer Login (`lecturer@jayaakademisi.local`) | Returns valid JWT token & role `lecturer` | HTTP 200 OK | **PASSED** |
| TC-04 | Student Login (`student@jayaakademisi.local`) | Returns valid JWT token & role `student` | HTTP 200 OK | **PASSED** |
| TC-05 | Course Catalog Listing | Returns >= 3 active university courses | HTTP 200 OK (3 courses) | **PASSED** |
| TC-06 | Category Master Listing | Returns >= 3 categories | HTTP 200 OK (3 categories) | **PASSED** |
| TC-07 | Course Creation by Lecturer | New course created and assigned to lecturer | HTTP 201 Created | **PASSED** |
| TC-08 | Module & Lesson Building | Modules & lessons attached with order index | HTTP 201 Created | **PASSED** |
| TC-09 | Course Discovery by Student | Student queries catalog, finds new course | HTTP 200 OK | **PASSED** |
| TC-10 | Student Enrollment | Student enrolls; duplicate enrollment prevented | HTTP 201 Created / 200 OK | **PASSED** |
| TC-11 | Lesson Completion Progress | Dynamic calculation reflects database records (50% -> 100%) | HTTP 200 OK | **PASSED** |
| TC-12 | Assignment Submission | Student submits text answers; status updated | HTTP 200 OK | **PASSED** |
| TC-13 | Evaluation & Grading | Lecturer assigns numerical score and feedback | HTTP 200 OK (Score 98.0) | **PASSED** |
| TC-14 | Student Gradebook Visibility | Graded score and feedback visible to student | HTTP 200 OK | **PASSED** |
| TC-15 | SQLite Data Persistence | All records persist intact across application restarts | Verified in fresh context | **PASSED** |
| TC-16 | Frontend Production Build | TypeScript typecheck and Vite bundle generate with 0 errors | 1565 modules built in 5.27s | **PASSED** |

## 3. SQLite Database Integrity Verification
Verification confirmed that the SQLite database engine at `backend/instance/jaya_akademisi.db` enforces:
1. `PRAGMA foreign_keys = ON;`
2. Unique constraints on `(user_id, course_id)` in enrollments.
3. Unique constraints on `(assignment_id, student_id)` in submissions.
4. Cascade deletion of modules and lessons upon course removal.
