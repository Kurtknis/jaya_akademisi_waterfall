import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Course, Category } from '../types';
import {
  GraduationCap, BookOpen, Users, Award, ArrowRight,
  CheckCircle, PlayCircle, Clock, Star
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/courses'),
      api.get('/courses/categories')
    ])
      .then(([cRes, catRes]) => {
        setFeaturedCourses(cRes.data.slice(0, 3));
        setCategories(catRes.data);
      })
      .catch((err) => console.error("Error loading landing data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-brand-400" />
                <span>Universitas Pembangunan Jaya Official LMS</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Learn Without Limits with <span className="text-brand-400">Jaya Akademisi</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Experience world-class university education online. Study courses authored by distinguished UPJ faculty, complete interactive modules, submit assignments, and track your graduation milestones.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-center shadow-lg shadow-brand-500/30 transition flex items-center justify-center space-x-2"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-center backdrop-blur-sm transition"
                >
                  Join as Student
                </Link>
              </div>

              {/* Quick stats banner */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-white/10 text-center sm:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Verified Faculty</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">Self-Paced</div>
                  <div className="text-xs text-slate-400 font-medium">Modular Curriculum</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">Real-Time</div>
                  <div className="text-xs text-slate-400 font-medium">Progress & Grading</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                      UPJ
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Academic Portal Access</h3>
                      <p className="text-xs text-slate-300">Ready to test demo environment</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold rounded-full border border-emerald-500/30">
                    Online
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="block font-semibold text-white">Administrator Account</span>
                      <span className="text-slate-300 font-mono text-[11px]">admin@jayaakademisi.local</span>
                    </div>
                    <Link
                      to="/login"
                      className="px-3 py-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-medium rounded-lg text-white"
                    >
                      Login
                    </Link>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="block font-semibold text-white">Lecturer Account</span>
                      <span className="text-slate-300 font-mono text-[11px]">lecturer@jayaakademisi.local</span>
                    </div>
                    <Link
                      to="/login"
                      className="px-3 py-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-medium rounded-lg text-white"
                    >
                      Login
                    </Link>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="block font-semibold text-white">Student Account</span>
                      <span className="text-slate-300 font-mono text-[11px]">student@jayaakademisi.local</span>
                    </div>
                    <Link
                      to="/login"
                      className="px-3 py-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-medium rounded-lg text-white"
                    >
                      Login
                    </Link>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-slate-300">
                  Password for demo accounts: <code className="bg-black/30 px-2 py-0.5 rounded text-brand-300 font-mono">Role123!</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Explore Academic Disciplines</h2>
            <p className="text-sm text-slate-600 mt-1">Browse our structured curriculums aligned with industry demands</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.slug}`}
                className="group p-6 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md bg-white transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center transition mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{cat.course_count || 1} Courses available</span>
                  <ArrowRight className="w-4 h-4 text-brand-500 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Top Rated Learning</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Featured University Courses</h2>
            </div>
            <Link
              to="/courses"
              className="mt-4 sm:mt-0 text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-brand-800/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-semibold">
                      {course.category_name}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-md text-[11px] font-bold">
                      {course.level}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-brand-600 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed flex-grow">
                      {course.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center space-x-2 text-xs text-slate-600">
                        <Users className="w-4 h-4 text-brand-500" />
                        <span className="font-medium text-slate-800">{course.instructor_name}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{course.total_modules} Modules ({course.total_lessons} Lessons)</span>
                        </div>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Free Enrollment
                        </span>
                      </div>

                      <Link
                        to={`/courses/${course.id}`}
                        className="w-full block py-2.5 text-center text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition"
                      >
                        Course Details & Syllabus
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Learn on Jaya Akademisi?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed specifically to meet the academic standards of Universitas Pembangunan Jaya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-600 flex items-center justify-center mb-4">
                <PlayCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Structured Video & Reading</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Stream lecture recordings, study downloadable reading materials, and navigate through modular units sequentially.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Real-Time Progress Calculation</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mark lessons completed as you advance. Progress percentages are tracked persistently in the database.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Assignment Review & Feedback</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Submit academic tasks directly and receive detailed evaluations, numeric scores, and feedback from your instructors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
