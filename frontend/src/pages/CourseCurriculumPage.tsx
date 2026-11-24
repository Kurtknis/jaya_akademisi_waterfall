import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Course, CourseModule, Lesson } from '../types';
import {
  ArrowLeft, PlusCircle, Trash2, Edit, PlayCircle,
  FileText, ExternalLink, Clock, Layers, Save, X
} from 'lucide-react';

export const CourseCurriculumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Module modal state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);

  // Lesson modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonResourceUrl, setLessonResourceUrl] = useState('');
  const [lessonDuration, setLessonDuration] = useState(15);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = () => {
    if (!id) return;
    setLoading(true);
    api.get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error('Failed to load course curriculum:', err))
      .finally(() => setLoading(false));
  };

  // Module CRUD
  const handleOpenModuleModal = (mod?: CourseModule) => {
    if (mod) {
      setEditingModuleId(mod.id);
      setModuleTitle(mod.title);
    } else {
      setEditingModuleId(null);
      setModuleTitle('');
    }
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !course) return;

    try {
      if (editingModuleId) {
        await api.put(`/modules/${editingModuleId}`, { title: moduleTitle.trim() });
      } else {
        await api.post(`/courses/${course.id}/modules`, { title: moduleTitle.trim() });
      }
      setIsModuleModalOpen(false);
      fetchCourse();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save module.');
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!window.confirm('Delete this module and all of its lessons?')) return;
    try {
      await api.delete(`/modules/${moduleId}`);
      fetchCourse();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete module.');
    }
  };

  // Lesson CRUD
  const handleOpenLessonModal = (moduleId: number, lesson?: Lesson) => {
    setTargetModuleId(moduleId);
    if (lesson) {
      setEditingLessonId(lesson.id);
      setLessonTitle(lesson.title);
      setLessonContent(lesson.content || '');
      setLessonVideoUrl(lesson.video_url || '');
      setLessonResourceUrl(lesson.resource_url || '');
      setLessonDuration(lesson.duration_minutes || 15);
    } else {
      setEditingLessonId(null);
      setLessonTitle('');
      setLessonContent('');
      setLessonVideoUrl('');
      setLessonResourceUrl('');
      setLessonDuration(15);
    }
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !targetModuleId) return;

    const payload = {
      title: lessonTitle.trim(),
      content: lessonContent.trim(),
      video_url: lessonVideoUrl.trim(),
      resource_url: lessonResourceUrl.trim(),
      duration_minutes: lessonDuration
    };

    try {
      if (editingLessonId) {
        await api.put(`/lessons/${editingLessonId}`, payload);
      } else {
        await api.post(`/modules/${targetModuleId}/lessons`, payload);
      }
      setIsLessonModalOpen(false);
      fetchCourse();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save lesson.');
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      fetchCourse();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete lesson.');
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
      <div className="text-center py-20">
        <p className="text-slate-600">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/lecturer/dashboard"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lecturer Dashboard</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Curriculum Builder: {course.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize syllabus modules, video embeds, reading materials, and resource links.
            </p>
          </div>

          <button
            onClick={() => handleOpenModuleModal()}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Module</span>
          </button>
        </div>

        {/* Modules Accordion List */}
        <div className="space-y-6">
          {course.modules?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No modules added to this course yet. Click "Add Module" to start structuring your syllabus.
            </div>
          ) : (
            course.modules?.map((module, mIdx) => (
              <div key={module.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                      {mIdx + 1}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{module.title}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenLessonModal(module.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 rounded-lg transition flex items-center space-x-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Lesson</span>
                    </button>
                    <button
                      onClick={() => handleOpenModuleModal(module)}
                      className="p-1 text-slate-500 hover:text-slate-800 rounded transition"
                      title="Edit Module Title"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                      title="Delete Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lessons in Module */}
                <div className="divide-y divide-slate-100">
                  {module.lessons?.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No lessons in this module. Click "Add Lesson" to add content.
                    </div>
                  ) : (
                    module.lessons?.map((lesson, lIdx) => (
                      <div key={lesson.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 transition">
                        <div className="flex items-center space-x-3">
                          <PlayCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800">{lesson.title}</span>
                            <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-0.5">
                              <span>Duration: {lesson.duration_minutes}m</span>
                              {lesson.video_url && <span>• Video attached</span>}
                              {lesson.resource_url && <span>• Resource link</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenLessonModal(module.id, lesson)}
                            className="p-1 text-slate-500 hover:text-slate-800 rounded transition"
                            title="Edit Lesson"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                            title="Delete Lesson"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Module Modal */}
        {isModuleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">
                  {editingModuleId ? 'Edit Module' : 'Create New Module'}
                </h3>
                <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveModule} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    placeholder="e.g. Module 1: Introduction to Distributed Systems"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModuleModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-lg"
                  >
                    Save Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lesson Modal */}
        {isLessonModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">
                  {editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
                </h3>
                <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveLesson} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="e.g. Lesson 1.1: Consistency and Replication"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Video Embed URL (YouTube / MP4)
                    </label>
                    <input
                      type="url"
                      value={lessonVideoUrl}
                      onChange={(e) => setLessonVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(parseInt(e.target.value) || 10)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Lecture Notes / Text Materials
                  </label>
                  <textarea
                    rows={5}
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    placeholder="Provide full academic notes, markdown code snippets, or instructions..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    External Resource / PDF URL
                  </label>
                  <input
                    type="url"
                    value={lessonResourceUrl}
                    onChange={(e) => setLessonResourceUrl(e.target.value)}
                    placeholder="https://example.com/handout.pdf"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsLessonModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-lg"
                  >
                    Save Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
