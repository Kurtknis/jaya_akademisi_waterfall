import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DashboardStats } from '../types';
import {
  BookOpen, CheckCircle, Clock, Award, ArrowRight,
  TrendingUp, PlayCircle
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to load dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const stats = data?.stats;
  const enrolledCourses = data?.enrolled_courses || [];
  const upcomingAssignments = data?.upcoming_assignments || [];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-brand-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
              Student Learning Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Universitas Pembangunan Jaya • Undergraduate Academic Portal
            </p>
          </div>
          <Link
            to="/courses"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <span>Browse More Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Enrolled Courses</span>
              <BookOpen className="w-5 h-5 text-brand-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.enrolled_courses || 0}
            </div>
            <span className="text-[11px] text-slate-400">Active university classes</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Completed Courses</span>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.completed_courses || 0}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">100% finished</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Average Progress</span>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.average_progress || 0}%
            </div>
            <span className="text-[11px] text-slate-400">Across all units</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.pending_assignments || 0}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">Assignments to submit</span>
          </div>
        </div>

        {/* Ongoing Courses + Upcoming Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Ongoing Courses List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Current Course Studies</h2>
                <p className="text-xs text-slate-500">Continue learning where you left off</p>
              </div>
              <Link to="/my-learning" className="text-xs font-semibold text-brand-600 hover:underline">
                View All
              </Link>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                You haven't enrolled in any courses yet.{' '}
                <Link to="/courses" className="text-brand-600 font-semibold underline">
                  Browse catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{course.title}</h3>
                        <p className="text-xs text-slate-500">{course.instructor_name}</p>
                      </div>
                    </div>

                    <div className="w-full sm:w-48 flex-shrink-0 space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Progress</span>
                        <span>{course.progress_percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-brand-500 h-1.5 rounded-full"
                          style={{ width: `${course.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      to={`/learn/${course.id}`}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition flex-shrink-0"
                    >
                      Classroom
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Assignments Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Upcoming Tasks</h2>
            <p className="text-xs text-slate-500 mb-4">Required student submissions</p>

            {upcomingAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No pending assignments at this time.</p>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate">{a.title}</span>
                      <span className="text-brand-600 font-semibold">{a.max_score} pts</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{a.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/student/grades"
                className="w-full block py-2 text-center text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                View Full Gradebook
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
