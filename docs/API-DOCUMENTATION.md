# Jaya Akademisi — REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/api/auth`)

### 1. Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Payload**:
  ```json
  {
    "name": "Raden Arya",
    "email": "arya@student.upj.ac.id",
    "password": "Password123!",
    "role": "student",
    "bio": "Informatics Engineering"
  }
  ```
- **Response**: `201 Created` with JWT token and user profile object.

### 2. Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Payload**:
  ```json
  {
    "email": "student@jayaakademisi.local",
    "password": "Student123!"
  }
  ```
- **Response**: `200 OK` with `{ "token": "...", "user": { ... } }`.

### 3. Current User Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

## Course Catalog (`/api/courses`)

### 1. List Courses
- **Method**: `GET`
- **Endpoint**: `/api/courses`
- **Query Params**:
  - `search`: string
  - `category`: string (slug)
  - `category_id`: integer
  - `level`: `Beginner` | `Intermediate` | `Advanced`
  - `my_courses`: boolean (`true` for lecturer's own authored courses)
- **Response**: `200 OK` (Array of Course summary objects).

### 2. Course Details & Curriculum
- **Method**: `GET`
- **Endpoint**: `/api/courses/<id_or_slug>`
- **Header**: Optional `Authorization: Bearer <token>`
- **Response**: `200 OK` (Includes `modules`, `lessons`, `assignments`, `is_enrolled`, and `progress_percentage`).

### 3. Create Course
- **Method**: `POST`
- **Endpoint**: `/api/courses`
- **Roles**: `lecturer`, `admin`
- **Payload**:
  ```json
  {
    "title": "Machine Learning Fundamentals",
    "description": "Introduction to supervised and unsupervised learning algorithms.",
    "objectives": "Understand regression; Implement classification.",
    "category_id": 1,
    "level": "Intermediate",
    "is_published": true
  }
  ```
- **Response**: `201 Created`

### 4. Update Course
- **Method**: `PUT`
- **Endpoint**: `/api/courses/<id>`
- **Roles**: `lecturer` (owner) or `admin`
- **Response**: `200 OK`

### 5. Delete Course
- **Method**: `DELETE`
- **Endpoint**: `/api/courses/<id>`
- **Roles**: `lecturer` (owner) or `admin`
- **Response**: `200 OK`

---

## Curriculum Builder (`/api`)

### 1. Create Module
- **Method**: `POST`
- **Endpoint**: `/api/courses/<course_id>/modules`
- **Roles**: `lecturer`, `admin`
- **Payload**: `{ "title": "Module 1: Foundations" }`
- **Response**: `201 Created`

### 2. Create Lesson
- **Method**: `POST`
- **Endpoint**: `/api/modules/<module_id>/lessons`
- **Roles**: `lecturer`, `admin`
- **Payload**:
  ```json
  {
    "title": "Lesson 1: Introduction",
    "content": "Lecture text materials...",
    "video_url": "https://www.youtube.com/embed/xyz",
    "resource_url": "https://example.com/handout.pdf",
    "duration_minutes": 20
  }
  ```
- **Response**: `201 Created`

---

## Enrollments & Progress (`/api`)

### 1. Enroll Course
- **Method**: `POST`
- **Endpoint**: `/api/courses/<course_id>/enroll`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `201 Created` (or `200 OK` if already enrolled)

### 2. My Enrolled Courses
- **Method**: `GET`
- **Endpoint**: `/api/my`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

### 3. Toggle Lesson Progress
- **Method**: `POST`
- **Endpoint**: `/api/lessons/<lesson_id>/toggle-complete`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "is_completed": true,
    "course_progress": {
      "percentage": 50.0,
      "completed_lessons": 1,
      "total_lessons": 2
    }
  }
  ```

---

## Assignments & Grading (`/api`)

### 1. Submit Assignment
- **Method**: `POST`
- **Endpoint**: `/api/assignments/<assignment_id>/submit`
- **Header**: `Authorization: Bearer <token>`
- **Payload**: `{ "submission_text": "Detailed student response..." }`
- **Response**: `200 OK`

### 2. Grade Submission
- **Method**: `PUT`
- **Endpoint**: `/api/submissions/<submission_id>/grade`
- **Roles**: `lecturer`, `admin`
- **Payload**:
  ```json
  {
    "score": 95.0,
    "feedback": "Comprehensive and clear explanation."
  }
  ```
- **Response**: `200 OK`

### 3. Student Gradebook
- **Method**: `GET`
- **Endpoint**: `/api/student/grades`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
