import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DashboardStats, Course } from '../types';
import {
  BookOpen, Users, FileCheck, Clock, PlusCircle,
  Edit, Trash2, Layers, ArrowRight, CheckCircle2
} from 'lucide-react';

export const LecturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    setLoading(true);
    api.get('/dashboard/stats')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to load lecturer dashboard:', err))
      .finally(() => setLoading(false));
  };

  const handleDeleteCourse = async (courseId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"? All modules, lessons, and student progress will be removed.`)) {
      return;
    }
    try {
      await api.delete(`/courses/${courseId}`);
      fetchDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete course.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const stats = data?.stats;
  const myCourses = data?.my_courses || [];
  const recentSubmissions = data?.recent_submissions || [];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-brand-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
              Faculty Instructor Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Universitas Pembangunan Jaya • Department Curriculum Management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/lecturer/courses/new"
              className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Course</span>
            </Link>
            <Link
              to="/lecturer/assignments"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center space-x-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Grade Submissions</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Authored Courses</span>
              <BookOpen className="w-5 h-5 text-brand-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.total_courses || 0}
            </div>
            <span className="text-[11px] text-slate-400">Published on platform</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Students</span>
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.total_students || 0}
            </div>
            <span className="text-[11px] text-slate-400">Enrolled across classes</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Assignments</span>
              <FileCheck className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.total_assignments || 0}
            </div>
            <span className="text-[11px] text-slate-400">Course tasks created</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pending Review</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.pending_grading || 0}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">Awaiting instructor evaluation</span>
          </div>
        </div>

        {/* My Courses List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Authored Courses</h2>
              <p className="text-xs text-slate-500">Manage syllabus, modules, lessons, and curriculum</p>
            </div>
            <Link
              to="/lecturer/courses/new"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              You have not created any courses yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myCourses.map((c) => (
                <div key={c.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                          {c.category_name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {c.level}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{c.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {c.total_modules} Modules • {c.total_lessons} Lessons • {c.enrolled_count} Students Enrolled
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link
                      to={`/lecturer/courses/${c.id}/curriculum`}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-700 font-semibold text-xs rounded-lg transition flex items-center space-x-1"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Curriculum</span>
                    </Link>
                    <Link
                      to={`/lecturer/courses/${c.id}/edit`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center space-x-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(c.id, c.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions to Grade */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Student Submissions</h2>
              <p className="text-xs text-slate-500">Tasks ready for evaluation and feedback</p>
            </div>
            <Link to="/lecturer/assignments" className="text-xs font-semibold text-brand-600 hover:underline">
              View All Tasks & Grading
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent assignment submissions.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{sub.student_name}</span>
                    <span className="text-slate-400 ml-2">submitted "{sub.assignment_title}"</span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      ({new Date(sub.submitted_at).toLocaleDateString()})
                    </span>
                  </div>

                  {sub.is_graded ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      Graded: {sub.score} pts
                    </span>
                  ) : (
                    <Link
                      to="/lecturer/assignments"
                      className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold transition"
                    >
                      Evaluate
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
