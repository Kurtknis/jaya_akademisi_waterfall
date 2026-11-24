# Database Design

## 1. Database Specifications
- **RDBMS**: SQLite 3
- **File Location**: `backend/instance/jaya_akademisi.db`
- **ORM**: SQLAlchemy / Flask-SQLAlchemy
- **Foreign Key Constraints**: Enabled via SQLite `PRAGMA foreign_keys = ON;`

## 2. Schema Specification & Tables

### 1. `users`
- `id` (INTEGER, Primary Key, Auto-increment)
- `name` (VARCHAR(120), NOT NULL)
- `email` (VARCHAR(120), UNIQUE, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `role` (VARCHAR(20), NOT NULL) — values: `admin`, `lecturer`, `student`
- `bio` (TEXT, NULL)
- `avatar_url` (VARCHAR(255), NULL)
- `is_active` (BOOLEAN, DEFAULT TRUE)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### 2. `categories`
- `id` (INTEGER, Primary Key, Auto-increment)
- `name` (VARCHAR(100), UNIQUE, NOT NULL)
- `slug` (VARCHAR(100), UNIQUE, NOT NULL)
- `description` (TEXT, NULL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### 3. `courses`
- `id` (INTEGER, Primary Key, Auto-increment)
- `title` (VARCHAR(200), NOT NULL)
- `slug` (VARCHAR(200), UNIQUE, NOT NULL)
- `description` (TEXT, NOT NULL)
- `objectives` (TEXT, NULL)
- `category_id` (INTEGER, FK -> `categories.id`, NOT NULL)
- `instructor_id` (INTEGER, FK -> `users.id`, NOT NULL)
- `image_url` (VARCHAR(255), NULL)
- `level` (VARCHAR(50), DEFAULT 'Beginner')
- `is_published` (BOOLEAN, DEFAULT TRUE)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### 4. `course_modules`
- `id` (INTEGER, Primary Key, Auto-increment)
- `course_id` (INTEGER, FK -> `courses.id`, ON DELETE CASCADE, NOT NULL)
- `title` (VARCHAR(200), NOT NULL)
- `order_index` (INTEGER, DEFAULT 1)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### 5. `lessons`
- `id` (INTEGER, Primary Key, Auto-increment)
- `module_id` (INTEGER, FK -> `course_modules.id`, ON DELETE CASCADE, NOT NULL)
- `title` (VARCHAR(200), NOT NULL)
- `content` (TEXT, NULL) — Lecture notes / HTML / Markdown
- `video_url` (VARCHAR(255), NULL) — YouTube / MP4 video link
- `resource_url` (VARCHAR(255), NULL) — PDF or external documentation
- `duration_minutes` (INTEGER, DEFAULT 10)
- `order_index` (INTEGER, DEFAULT 1)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### 6. `enrollments`
- `id` (INTEGER, Primary Key, Auto-increment)
- `user_id` (INTEGER, FK -> `users.id`, ON DELETE CASCADE, NOT NULL)
- `course_id` (INTEGER, FK -> `courses.id`, ON DELETE CASCADE, NOT NULL)
- `enrolled_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- *Constraint*: `UNIQUE(user_id, course_id)`

### 7. `lesson_progress`
- `id` (INTEGER, Primary Key, Auto-increment)
- `user_id` (INTEGER, FK -> `users.id`, ON DELETE CASCADE, NOT NULL)
- `lesson_id` (INTEGER, FK -> `lessons.id`, ON DELETE CASCADE, NOT NULL)
- `is_completed` (BOOLEAN, DEFAULT TRUE)
- `completed_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- *Constraint*: `UNIQUE(user_id, lesson_id)`

### 8. `assignments`
- `id` (INTEGER, Primary Key, Auto-increment)
- `course_id` (INTEGER, FK -> `courses.id`, ON DELETE CASCADE, NOT NULL)
- `title` (VARCHAR(200), NOT NULL)
- `description` (TEXT, NOT NULL)
- `max_score` (INTEGER, DEFAULT 100)
- `due_date` (DATETIME, NULL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### 9. `assignment_submissions`
- `id` (INTEGER, Primary Key, Auto-increment)
- `assignment_id` (INTEGER, FK -> `assignments.id`, ON DELETE CASCADE, NOT NULL)
- `student_id` (INTEGER, FK -> `users.id`, ON DELETE CASCADE, NOT NULL)
- `submission_text` (TEXT, NOT NULL)
- `score` (FLOAT, NULL)
- `feedback` (TEXT, NULL)
- `graded_by` (INTEGER, FK -> `users.id`, NULL)
- `submitted_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- `graded_at` (DATETIME, NULL)
- *Constraint*: `UNIQUE(assignment_id, student_id)`
