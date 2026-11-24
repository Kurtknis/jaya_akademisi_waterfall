import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Course, Assignment, AssignmentSubmission } from '../types';
import {
  FileCheck, PlusCircle, CheckCircle2, Clock,
  ArrowRight, X, Award, MessageSquare, AlertCircle
} from 'lucide-react';

export const LecturerAssignmentsPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Assignment Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMaxScore, setNewMaxScore] = useState(100);
  const [newDueDate, setNewDueDate] = useState('');

  // Grading Modal
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [scoreInput, setScoreInput] = useState<number | ''>('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  useEffect(() => {
    // Fetch lecturer's courses
    api.get('/courses?my_courses=true')
      .then((res) => {
        setCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourseId(res.data[0].id);
        }
      })
      .catch((err) => console.error('Failed to load courses:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseAssignments(selectedCourseId);
    }
  }, [selectedCourseId]);

  const loadCourseAssignments = async (cId: number) => {
    try {
      const res = await api.get(`/courses/${cId}/assignments`);
      setAssignments(res.data);
      if (res.data.length > 0) {
        loadSubmissions(res.data[0]);
      } else {
        setSelectedAssignment(null);
        setSubmissions([]);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    }
  };

  const loadSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    try {
      const res = await api.get(`/assignments/${assignment.id}/submissions`);
      setSubmissions(res.data.submissions);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !newTitle.trim() || !newDesc.trim()) return;

    try {
      await api.post(`/courses/${selectedCourseId}/assignments`, {
        title: newTitle.trim(),
        description: newDesc.trim(),
        max_score: Number(newMaxScore),
        due_date: newDueDate || null
      });
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      loadCourseAssignments(selectedCourseId);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create assignment.');
    }
  };

  const handleOpenGradeModal = (sub: AssignmentSubmission) => {
    setGradingSubmission(sub);
    setScoreInput(sub.score !== null && sub.score !== undefined ? sub.score : '');
    setFeedbackInput(sub.feedback || '');
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission || scoreInput === '') return;

    setSubmittingGrade(true);
    try {
      await api.put(`/submissions/${gradingSubmission.id}/grade`, {
        score: Number(scoreInput),
        feedback: feedbackInput.trim()
      });
      setGradingSubmission(null);
      if (selectedAssignment) {
        loadSubmissions(selectedAssignment);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit grade.');
    } finally {
      setSubmittingGrade(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Assignments & Grading Portal
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Create academic coursework and evaluate student responses with numeric grades and feedback.
            </p>
          </div>

          {selectedCourseId && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          )}
        </div>

        {/* Course Selector Tabs */}
        {courses.length > 0 && (
          <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${
                  selectedCourseId === c.id
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {/* Two-Pane Layout: Assignment list on Left, Submissions on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Assignment List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-base text-slate-900">Course Assignments</h2>

            {assignments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No assignments found for this course. Click "Create Assignment" above.
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((a) => {
                  const isSelected = selectedAssignment?.id === a.id;

                  return (
                    <div
                      key={a.id}
                      onClick={() => loadSubmissions(a)}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{a.title}</span>
                        <span className="text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-[11px]">
                          Max: {a.max_score} pts
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1 line-clamp-2">{a.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                        <span>{a.total_submissions} submissions</span>
                        {a.due_date && <span>Due: {new Date(a.due_date).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submissions List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-slate-900">
                  {selectedAssignment ? `Submissions: ${selectedAssignment.title}` : 'Submissions'}
                </h2>
                <p className="text-xs text-slate-500">
                  {submissions.length} total student submissions received
                </p>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No student has submitted an answer to this assignment yet.
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{sub.student_name}</span>
                        <span className="text-slate-400 ml-2">({sub.student_email})</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        Submitted {new Date(sub.submitted_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap font-sans">
                      {sub.submission_text}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div>
                        {sub.is_graded ? (
                          <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Score: {sub.score} / {selectedAssignment?.max_score}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-amber-600 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Ungraded</span>
                          </div>
                        )}
                        {sub.feedback && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            Feedback: "{sub.feedback}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenGradeModal(sub)}
                        className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg shadow-sm transition"
                      >
                        {sub.is_graded ? 'Edit Grade' : 'Assign Grade'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Assignment Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Create New Course Assignment</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Practical Lab 1: Schema Normalization"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Max Score
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newMaxScore}
                      onChange={(e) => setNewMaxScore(parseInt(e.target.value) || 100)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Assignment Description & Criteria *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe requirements, deliverables, and instructions for students..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-lg shadow"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grading Modal */}
        {gradingSubmission && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">
                  Grade Submission: {gradingSubmission.student_name}
                </h3>
                <button onClick={() => setGradingSubmission(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitGrade} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Score (0 - {selectedAssignment?.max_score}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={selectedAssignment?.max_score}
                    required
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Written Feedback & Remarks
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Provide constructive feedback for student improvement..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setGradingSubmission(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingGrade}
                    className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-lg shadow disabled:opacity-50"
                  >
                    {submittingGrade ? 'Saving Grade...' : 'Save Grade'}
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
