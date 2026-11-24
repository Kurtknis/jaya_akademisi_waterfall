export type UserRole = 'admin' | 'lecturer' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  course_count?: number;
  created_at?: string;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content?: string;
  video_url?: string;
  resource_url?: string;
  duration_minutes: number;
  order_index: number;
  is_completed?: boolean;
  created_at?: string;
}

export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  order_index: number;
  lessons?: Lesson[];
  created_at?: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  objectives?: string;
  category_id: number;
  category_name: string;
  instructor_id: number;
  instructor_name: string;
  instructor_bio?: string;
  image_url: string;
  level: string;
  is_published: boolean;
  total_modules: number;
  total_lessons: number;
  enrolled_count: number;
  is_enrolled?: boolean;
  enrolled_at?: string;
  progress_percentage?: number;
  completed_lessons?: number;
  modules?: CourseModule[];
  assignments?: Assignment[];
  created_at?: string;
  updated_at?: string;
}

export interface Assignment {
  id: number;
  course_id: number;
  course_title?: string;
  title: string;
  description: string;
  max_score: number;
  due_date?: string;
  total_submissions?: number;
  user_submission?: AssignmentSubmission | null;
  created_at?: string;
}

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  assignment_title?: string;
  student_id: number;
  student_name: string;
  student_email: string;
  submission_text: string;
  score?: number | null;
  feedback?: string | null;
  is_graded: boolean;
  graded_by_name?: string | null;
  submitted_at: string;
  graded_at?: string | null;
}

export interface DashboardStats {
  role: UserRole;
  stats: {
    total_students?: number;
    total_lecturers?: number;
    total_courses?: number;
    total_enrollments?: number;
    total_assignments?: number;
    pending_grading?: number;
    enrolled_courses?: number;
    completed_courses?: number;
    average_progress?: number;
    pending_assignments?: number;
  };
  recent_enrollments?: Array<{
    id: number;
    student_name: string;
    course_title: string;
    enrolled_at: string;
  }>;
  recent_users?: User[];
  my_courses?: Course[];
  recent_submissions?: AssignmentSubmission[];
  enrolled_courses?: Course[];
  upcoming_assignments?: Assignment[];
}
