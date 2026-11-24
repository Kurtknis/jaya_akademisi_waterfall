import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Course } from '../types';
import { BookOpen, CheckCircle, ArrowRight, PlayCircle, Clock } from 'lucide-react';

export const MyLearningPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/my')
      .then((res) => setCourses(res.data))
      .catch((err) => console.error('Failed to fetch enrolled courses:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Learning
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track your ongoing courses, progress metrics, and lesson completion status.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">You are not enrolled in any courses yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore our academic catalog and enroll in courses to start your studies.
            </p>
            <Link
              to="/courses"
              className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-lg transition"
            >
              <span>Explore Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const progress = course.progress_percentage || 0;
              const isCompleted = progress >= 100;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-brand-800/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-semibold">
                      {course.category_name}
                    </div>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1 shadow">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-base text-slate-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Instructor: {course.instructor_name}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 flex-grow flex flex-col justify-end">
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-600">Course Progress</span>
                          <span className="text-brand-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span>{course.completed_lessons || 0} of {course.total_lessons} lessons completed</span>
                        </div>
                      </div>

                      <Link
                        to={`/learn/${course.id}`}
                        className="w-full block py-2.5 text-center text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm transition"
                      >
                        {isCompleted ? 'Review Classroom' : 'Continue Learning'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
