import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { MyLearningPage } from './pages/MyLearningPage';
import { LearningClassroomPage } from './pages/LearningClassroomPage';
import { StudentGradesPage } from './pages/StudentGradesPage';

// Lecturer Pages
import { LecturerDashboard } from './pages/LecturerDashboard';
import { CourseEditorPage } from './pages/CourseEditorPage';
import { CourseCurriculumPage } from './pages/CourseCurriculumPage';
import { LecturerAssignmentsPage } from './pages/LecturerAssignmentsPage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/courses" element={<CourseCatalogPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/my-learning" element={<MyLearningPage />} />
                <Route path="/learn/:courseId" element={<LearningClassroomPage />} />
                <Route path="/learn/:courseId/lesson/:lessonId" element={<LearningClassroomPage />} />
                <Route path="/student/grades" element={<StudentGradesPage />} />
              </Route>

              {/* Lecturer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['lecturer', 'admin']} />}>
                <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
                <Route path="/lecturer/courses/new" element={<CourseEditorPage />} />
                <Route path="/lecturer/courses/:id/edit" element={<CourseEditorPage />} />
                <Route path="/lecturer/courses/:id/curriculum" element={<CourseCurriculumPage />} />
                <Route path="/lecturer/assignments" element={<LecturerAssignmentsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
