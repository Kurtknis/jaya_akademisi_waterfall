import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Course, CourseModule, Lesson, Assignment } from '../types';
import {
  PlayCircle, CheckCircle2, Circle, ArrowLeft, ArrowRight,
  ExternalLink, FileText, Check, Award, BookOpen, Clock
} from 'lucide-react';

export const LearningClassroomPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [activeTab, setActiveTab] = useState<'lesson' | 'assignments'>('lesson');
  const [submissionText, setSubmissionText] = useState<{ [key: number]: string }>({});
  const [submittingAssignment, setSubmittingAssignment] = useState<number | null>(null);
  const [assignmentFeedback, setAssignmentFeedback] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseAndProgress();
  }, [courseId]);

  const fetchCourseAndProgress = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const [courseRes, progRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/courses/${courseId}/progress`)
      ]);

      const cData: Course = courseRes.data;
      setCourse(cData);
      setCompletedLessonIds(progRes.data.completed_lesson_ids || []);
      setProgressPercentage(progRes.data.percentage || 0);

      // Select initial lesson
      if (lessonId) {
        const found = findLesson(cData, parseInt(lessonId));
        if (found) setActiveLesson(found);
      } else if (cData.modules && cData.modules.length > 0) {
        const firstMod = cData.modules[0];
        if (firstMod.lessons && firstMod.lessons.length > 0) {
          setActiveLesson(firstMod.lessons[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load classroom data:', err);
    } finally {
      setLoading(false);
    }
  };

  const findLesson = (c: Course, lId: number): Lesson | null => {
    if (!c.modules) return null;
    for (const m of c.modules) {
      if (m.lessons) {
        const found = m.lessons.find((l) => l.id === lId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveTab('lesson');
    navigate(`/learn/${courseId}/lesson/${lesson.id}`, { replace: true });
  };

  const handleToggleComplete = async () => {
    if (!activeLesson) return;
    setMarking(true);
    try {
      const res = await api.post(`/lessons/${activeLesson.id}/toggle-complete`);
      const isCompleted = res.data.is_completed;
      const newPercentage = res.data.course_progress.percentage;

      setProgressPercentage(newPercentage);
      if (isCompleted) {
        setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
      } else {
        setCompletedLessonIds((prev) => prev.filter((id) => id !== activeLesson.id));
      }
    } catch (err) {
      console.error('Failed to update lesson completion:', err);
    } finally {
      setMarking(false);
    }
  };

  const getNextLesson = (): Lesson | null => {
    if (!course || !course.modules || !activeLesson) return null;
    const allLessons: Lesson[] = [];
    course.modules.forEach((m) => {
      if (m.lessons) allLessons.push(...m.lessons);
    });
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex !== -1 && currentIndex + 1 < allLessons.length) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const handleNextLesson = () => {
    const next = getNextLesson();
    if (next) {
      handleSelectLesson(next);
    }
  };

  const handleAssignmentSubmit = async (assignmentId: number) => {
    const text = submissionText[assignmentId];
    if (!text || !text.trim()) {
      alert('Please enter your submission text before submitting.');
      return;
    }

    setSubmittingAssignment(assignmentId);
    setAssignmentFeedback('');
    try {
      await api.post(`/assignments/${assignmentId}/submit`, { submission_text: text });
      setAssignmentFeedback('Assignment submitted successfully! The instructor will review your work.');
      // Refresh course to update assignment status
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit assignment.');
    } finally {
      setSubmittingAssignment(null);
    }
  };

  const isCurrentCompleted = activeLesson ? completedLessonIds.includes(activeLesson.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen p-10 text-center">
        <p className="text-slate-600">Course could not be loaded.</p>
        <Link to="/courses" className="text-brand-600 underline text-sm mt-2 block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Classroom Sub-Header */}
      <header className="bg-brand-900 text-white px-6 py-3 flex items-center justify-between border-b border-brand-800 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Link
            to="/my-learning"
            className="p-1 text-slate-300 hover:text-white hover:bg-brand-800 rounded-lg transition"
            title="Back to My Learning"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight truncate max-w-md sm:max-w-xl">
              {course.title}
            </h1>
            <p className="text-[11px] text-brand-300">
              Instructor: {course.instructor_name}
            </p>
          </div>
        </div>

        {/* Progress Bar & Tabs */}
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-3">
            <span className="text-xs text-slate-300 font-medium">Progress</span>
            <div className="w-32 bg-brand-950 rounded-full h-2 overflow-hidden border border-brand-700">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-emerald-400">{progressPercentage}%</span>
          </div>

          <div className="flex items-center bg-brand-950 p-1 rounded-lg border border-brand-800 text-xs">
            <button
              onClick={() => setActiveTab('lesson')}
              className={`px-3 py-1 rounded font-semibold transition ${
                activeTab === 'lesson' ? 'bg-brand-500 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lesson
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-3 py-1 rounded font-semibold transition ${
                activeTab === 'assignments' ? 'bg-brand-500 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Assignments ({course.assignments?.length || 0})
            </button>
          </div>
        </div>
      </header>

      {/* Main Classroom Workspace: Sidebar + Lesson Viewer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Modules Sidebar */}
        <aside className="w-80 sm:w-96 bg-slate-50 border-r border-slate-200 overflow-y-auto flex-shrink-0 flex flex-col custom-scrollbar">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Syllabus</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {completedLessonIds.length} of {course.total_lessons} lessons completed
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {course.modules?.map((module, mIdx) => (
              <div key={module.id} className="p-3">
                <div className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                  {module.title}
                </div>

                <div className="space-y-1">
                  {module.lessons?.map((lesson) => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isActive = activeLesson?.id === lesson.id && activeTab === 'lesson';

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between group ${
                          isActive
                            ? 'bg-brand-50 border border-brand-300 text-brand-900 font-bold shadow-sm'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate mr-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-slate-400" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {lesson.duration_minutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 overflow-y-auto bg-white p-6 sm:p-10 custom-scrollbar">
          {activeTab === 'lesson' && activeLesson ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Lesson Top Meta & Completion Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                    {course.title}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    {activeLesson.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleToggleComplete}
                    disabled={marking}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 shadow-sm ${
                      isCurrentCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-brand-500 text-white hover:bg-brand-600'
                    }`}
                  >
                    {isCurrentCompleted ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>

                  {getNextLesson() && (
                    <button
                      onClick={handleNextLesson}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Video Embed Player */}
              {activeLesson.video_url && (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800">
                  <iframe
                    src={activeLesson.video_url}
                    title={activeLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Lesson Text / Reading Materials */}
              <div className="prose prose-slate max-w-none text-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Lecture Materials & Notes</h3>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {activeLesson.content || 'No text content provided for this lesson.'}
                </div>
              </div>

              {/* Resource Download / Link */}
              {activeLesson.resource_url && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-brand-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Supplemental Academic Resource</h4>
                      <p className="text-[11px] text-slate-500">Read additional reference materials</p>
                    </div>
                  </div>
                  <a
                    href={activeLesson.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white border border-blue-300 text-brand-700 font-semibold text-xs rounded-lg hover:bg-blue-100 transition flex items-center space-x-1.5"
                  >
                    <span>Open Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ) : activeTab === 'assignments' ? (
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Course Assignments & Tasks</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Submit required assignments to fulfill course grading criteria.
                </p>
              </div>

              {assignmentFeedback && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                  {assignmentFeedback}
                </div>
              )}

              <div className="space-y-6">
                {course.assignments?.length === 0 ? (
                  <p className="text-xs text-slate-500">No assignments created for this course yet.</p>
                ) : (
                  course.assignments?.map((assign) => {
                    const sub = assign.user_submission;

                    return (
                      <div key={assign.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-base text-slate-900">{assign.title}</h3>
                            <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{assign.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                              Max Score: {assign.max_score}
                            </span>
                          </div>
                        </div>

                        {sub ? (
                          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700">Your Submission:</span>
                              <span className="text-slate-400">
                                Submitted on {new Date(sub.submitted_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                              {sub.submission_text}
                            </p>

                            {sub.is_graded ? (
                              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                                <div className="flex items-center justify-between font-bold text-emerald-800">
                                  <span>Grade Awarded: {sub.score} / {assign.max_score}</span>
                                  <span>Graded by {sub.graded_by_name || 'Instructor'}</span>
                                </div>
                                {sub.feedback && (
                                  <p className="text-slate-700 mt-1">
                                    <strong>Feedback:</strong> {sub.feedback}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                Submission received and pending lecturer evaluation.
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <label className="block text-xs font-semibold text-slate-700">
                              Your Answer / Response:
                            </label>
                            <textarea
                              rows={4}
                              value={submissionText[assign.id] || ''}
                              onChange={(e) =>
                                setSubmissionText({
                                  ...submissionText,
                                  [assign.id]: e.target.value
                                })
                              }
                              placeholder="Type your complete solution, links to code, or essay response..."
                              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            />
                            <button
                              onClick={() => handleAssignmentSubmit(assign.id)}
                              disabled={submittingAssignment === assign.id}
                              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50"
                            >
                              {submittingAssignment === assign.id ? 'Submitting...' : 'Submit Assignment'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Select a lesson from the syllabus sidebar to begin studying.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
