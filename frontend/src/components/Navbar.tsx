import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, BookOpen, LayoutDashboard, LogOut,
  User, CheckSquare, Layers, ShieldCheck, PlusCircle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isLecturer, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isLecturer) return '/lecturer/dashboard';
    return '/student/dashboard';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-lg bg-brand-800 flex items-center justify-center text-white shadow">
                <GraduationCap className="w-6 h-6 text-brand-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-brand-800 leading-tight tracking-tight">
                  JAYA AKADEMISI
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-brand-500 uppercase">
                  Universitas Pembangunan Jaya
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/courses"
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-500 hover:bg-slate-50 rounded-md transition"
              >
                Explore Courses
              </Link>
              {isAuthenticated && isStudent && (
                <>
                  <Link
                    to="/my-learning"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-500 hover:bg-slate-50 rounded-md transition"
                  >
                    My Learning
                  </Link>
                  <Link
                    to="/student/grades"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-500 hover:bg-slate-50 rounded-md transition"
                  >
                    Grades & Tasks
                  </Link>
                </>
              )}
              {isAuthenticated && isLecturer && (
                <>
                  <Link
                    to="/lecturer/courses/new"
                    className="px-3 py-2 text-sm font-medium text-brand-600 hover:bg-blue-50 rounded-md transition flex items-center space-x-1"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Create Course
                  </Link>
                  <Link
                    to="/lecturer/assignments"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-500 hover:bg-slate-50 rounded-md transition"
                  >
                    Grade Submissions
                  </Link>
                </>
              )}
              {isAuthenticated && isAdmin && (
                <>
                  <Link
                    to="/admin/users"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-500 hover:bg-slate-50 rounded-md transition"
                  >
                    User Management
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-500 hover:bg-slate-50 rounded-md transition"
                  >
                    Categories
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardLink()}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-brand-600" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-300 flex items-center justify-center text-brand-800 font-bold text-xs uppercase overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-brand-600">
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-500 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm transition"
                >
                  Join for Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
