import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Course, CourseModule } from '../types';
import {
  GraduationCap, BookOpen, Clock, Users, PlayCircle,
  FileText, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.get(`/courses/${id}`)
        .then((res) => setCourse(res.data))
        .catch((err) => console.error("Error fetching course detail:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!course) return;

    setEnrolling(true);
    try {
      const res = await api.post(`/courses/${course.id}/enroll`);
      setEnrollMsg('Successfully enrolled! Redirecting to classroom...');
      setTimeout(() => {
        navigate(`/learn/${course.id}`);
      }, 1000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Course Not Found</h2>
        <Link to="/courses" className="mt-4 inline-block text-brand-600 underline text-sm">
          Return to Course Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Course Banner Header */}
      <section className="bg-brand-900 text-white py-14 border-b border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-brand-500 font-semibold text-white">
                  {course.category_name}
                </span>
                <span className="px-2.5 py-1 rounded bg-white/10 font-medium text-slate-200">
                  {course.level}
                </span>
                <span className="text-slate-300">
                  • {course.enrolled_count} Students Enrolled
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              <div className="pt-2 flex items-center space-x-3 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span>Instructor: <strong className="text-white">{course.instructor_name}</strong></span>
                </div>
                <span>•</span>
                <span>UPJ Academic Faculty</span>
              </div>
            </div>

            {/* Sticky Action Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 text-slate-800 shadow-xl border border-slate-200 space-y-4">
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {enrollMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                    {enrollMsg}
                  </div>
                )}

                {course.is_enrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Your Progress</span>
                      <span className="text-brand-600">{course.progress_percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress_percentage || 0}%` }}
                      ></div>
                    </div>
                    <Link
                      to={`/learn/${course.id}`}
                      className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-lg shadow transition flex items-center justify-center space-x-2"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-lg shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{enrolling ? 'Enrolling...' : 'Enroll in this Course (Free)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-brand-500" />
                      <span>Modules</span>
                    </span>
                    <span className="font-semibold">{course.total_modules} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <PlayCircle className="w-4 h-4 text-brand-500" />
                      <span>Lessons</span>
                    </span>
                    <span className="font-semibold">{course.total_lessons} items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-brand-500" />
                      <span>Assignments</span>
                    </span>
                    <span className="font-semibold">{course.assignments?.length || 0} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Objectives, Curriculum, Instructor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Learning Objectives */}
          {course.objectives && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">What You Will Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.objectives.split(';').map((obj, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{obj.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Syllabus */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Course Curriculum</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {course.modules?.length || 0} modules • {course.total_lessons} lessons
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {course.modules?.map((mod, index) => (
                <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">
                      {mod.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {mod.lessons?.length || 0} lessons
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 bg-white">
                    {mod.lessons?.map((lesson) => (
                      <div key={lesson.id} className="px-4 py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <PlayCircle className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-700">{lesson.title}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{lesson.duration_minutes} min</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Instructor</h2>
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 border border-brand-300 flex items-center justify-center font-bold text-brand-800 text-lg flex-shrink-0">
                {course.instructor_name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">{course.instructor_name}</h3>
                <p className="text-xs text-brand-600 font-medium">Faculty Member at Universitas Pembangunan Jaya</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {course.instructor_bio || 'Experienced academic practitioner committed to digital education and student mastery.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
