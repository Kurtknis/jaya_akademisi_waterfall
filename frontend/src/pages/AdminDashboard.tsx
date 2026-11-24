import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DashboardStats } from '../types';
import {
  Users, BookOpen, GraduationCap, Layers,
  ShieldCheck, ArrowRight, CheckCircle2, UserCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to load admin stats:', err))
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
  const recentEnrollments = data?.recent_enrollments || [];
  const recentUsers = data?.recent_users || [];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-brand-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
              System Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Jaya Akademisi Admin Control Panel
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Universitas Pembangunan Jaya • Master Database & Academic Registry
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Manage Users</span>
            </Link>
            <Link
              to="/admin/categories"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center space-x-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Students</span>
              <GraduationCap className="w-5 h-5 text-brand-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.total_students || 0}
            </div>
            <span className="text-[11px] text-slate-400">Registered learners</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Faculty Lecturers</span>
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.total_lecturers || 0}
            </div>
            <span className="text-[11px] text-slate-400">Course instructors</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Courses</span>
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.total_courses || 0}
            </div>
            <span className="text-[11px] text-slate-400">In university catalog</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Enrollments</span>
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {stats?.total_enrollments || 0}
            </div>
            <span className="text-[11px] text-slate-400">Student course registrations</span>
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Accounts</h2>
                <p className="text-xs text-slate-500">Newly registered users on the platform</p>
              </div>
              <Link to="/admin/users" className="text-xs font-semibold text-brand-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentUsers.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                    u.role === 'lecturer' ? 'bg-blue-50 text-brand-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Enrollments</h2>
                <p className="text-xs text-slate-500">Student class enrollments</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {recentEnrollments.map((enr) => (
                <div key={enr.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{enr.student_name}</span>
                    <span className="text-slate-400 ml-2">enrolled in</span>
                    <span className="font-semibold text-brand-600 ml-1">"{enr.course_title}"</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(enr.enrolled_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
