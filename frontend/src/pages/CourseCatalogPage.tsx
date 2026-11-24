import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Course, Category } from '../types';
import { Search, Filter, BookOpen, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedLevel = searchParams.get('level') || '';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, catsRes] = await Promise.all([
        api.get('/courses', {
          params: {
            search: searchParams.get('search') || undefined,
            category: searchParams.get('category') || undefined,
            level: searchParams.get('level') || undefined,
          }
        }),
        api.get('/courses/categories')
      ]);
      setCourses(coursesRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategoryFilter = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory === slug) {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleLevelFilter = (level: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedLevel === level) {
      newParams.delete('level');
    } else {
      newParams.set('level', level);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Course Catalog
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Explore university courses authored by Universitas Pembangunan Jaya professors and departments.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search courses by keyword, topic, or technology..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-lg transition"
            >
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Categories:</span>
            </span>

            <button
              onClick={() => handleCategoryFilter('')}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition ${
                !selectedCategory
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              All Categories
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryFilter(c.slug)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition ${
                  selectedCategory === c.slug
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}

            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-4 mr-2">Level:</span>
            {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelFilter(lvl)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition ${
                  selectedLevel === lvl
                    ? 'bg-brand-800 text-white border-brand-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No courses match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search keyword or selecting another category.</p>
            <button
              onClick={() => setSearchParams({})}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-4">
              Showing {courses.length} courses
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
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
                          <span>{course.total_modules} Modules • {course.total_lessons} Lessons</span>
                        </div>
                        {course.is_enrolled && (
                          <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enrolled</span>
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/courses/${course.id}`}
                        className="w-full block py-2.5 text-center text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition"
                      >
                        {course.is_enrolled ? 'Go to Classroom' : 'View Course & Syllabus'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
