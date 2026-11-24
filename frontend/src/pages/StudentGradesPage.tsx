import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AssignmentSubmission, Assignment } from '../types';
import { Award, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const StudentGradesPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/grades')
      .then((res) => {
        setSubmissions(res.data.submissions || []);
        setPendingAssignments(res.data.pending_assignments || []);
      })
      .catch((err) => console.error('Failed to load grades:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Grades & Tasks
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review assignment evaluations, scores, instructor feedback, and pending tasks.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Submissions Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="font-bold text-base text-slate-900">Submitted Assignments</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tasks submitted for grading and evaluation
                </p>
              </div>

              {submissions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No assignments submitted yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-6">Assignment</th>
                        <th className="py-3.5 px-6">Submitted At</th>
                        <th className="py-3.5 px-6">Grade / Score</th>
                        <th className="py-3.5 px-6">Instructor Feedback</th>
                        <th className="py-3.5 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-4 px-6 font-semibold text-slate-900">
                            {sub.assignment_title || `Assignment #${sub.assignment_id}`}
                          </td>
                          <td className="py-4 px-6 text-slate-500">
                            {new Date(sub.submitted_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            {sub.is_graded ? (
                              <span className="font-extrabold text-sm text-emerald-600">
                                {sub.score} pts
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium">Pending</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                            {sub.feedback || '—'}
                          </td>
                          <td className="py-4 px-6">
                            {sub.is_graded ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Graded</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Awaiting Review</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pending Tasks Section */}
            {pendingAssignments.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-base text-slate-900 mb-4">Pending Course Tasks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingAssignments.map((pa) => (
                    <div key={pa.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{pa.title}</span>
                        <span className="text-brand-600 font-semibold">{pa.max_score} pts</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{pa.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
