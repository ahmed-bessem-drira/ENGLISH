import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { resultService } from '../services/resultService';

const StudentResults = () => {
  const { id, studentId } = useParams();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId');
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessionDetails();
  }, [id, studentId]);

  const loadSessionDetails = async () => {
    try {
      const data = await resultService.getSessionDetails(id, studentId);
      setSessionData(data);
    } catch (error) {
      console.error('Failed to load session details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAnswer = async (answerId, reviewData) => {
    try {
      await resultService.reviewAnswer(id, answerId, reviewData);
      loadSessionDetails();
    } catch (error) {
      console.error('Failed to review answer:', error);
      alert('Failed to save review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading student submission details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-7">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to={`/lessons/${id}/results${classId ? `?classId=${classId}` : ''}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 mb-2.5"
          >
            <span>←</span>
            <span>Back to All Results</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {sessionData?.session.studentName}
              </span>
              's Submission
            </h1>
            {sessionData?.session.className && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                <span>🏫</span>
                <span>{sessionData.session.className}</span>
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Detailed answers, automated scoring, and teacher grading feedback for this session.
          </p>
        </div>
      </div>

      {sessionData && (
        <>
          {/* Stat Cards Grid (4 cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Total Score */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Overall Score</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {sessionData.score.percentage}%
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 tabular-nums">
                  {sessionData.score.earnedPoints}
                </span>
                <span className="text-slate-400 font-semibold text-sm">
                  / {sessionData.score.totalPoints} pts
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  style={{ width: `${Math.min(sessionData.score.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Correct Answers */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Correct Answers</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 tabular-nums">
                  {sessionData.score.correctCount}
                </span>
                <span className="text-xs text-slate-400 font-medium">questions</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-2">Passed verification</p>
            </div>

            {/* Incorrect Answers */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Incorrect Answers</span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  ✕
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-600 tabular-nums">
                  {sessionData.score.incorrectCount}
                </span>
                <span className="text-xs text-slate-400 font-medium">questions</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-2">Need practice</p>
            </div>

            {/* Status */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Session Status</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  📋
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {sessionData.session.status}
                </span>
              </div>
              <p className="text-[11px] text-purple-600 font-semibold mt-2">Submission recorded</p>
            </div>
          </div>

          {/* Answer Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  📝
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Question-by-Question Breakdown</h2>
                  <p className="text-xs text-slate-400">Review student responses and apply teacher grading feedback</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-2xs">
                {(sessionData.answers || []).length} questions
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {(sessionData.answers || []).map((answer, index) => (
                <div key={answer.id || answer.questionId} className="p-6 hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-xs">
                          {index + 1}
                        </span>
                        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 text-slate-700">
                          {answer.questionType === 'multiple_choice' ? 'Multiple Choice' : 'Written Response'}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                          answer.isCorrect
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${answer.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {answer.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                        <span className="text-xs font-bold text-slate-500 ml-auto">
                          Points: <span className="text-slate-900 font-extrabold">{answer.points ?? 0}</span>/{answer.maxPoints ?? 1}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {answer.questionText}
                      </h3>

                      {/* Answers Comparison Box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {/* Student Response */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                            Student Answer
                          </span>
                          <p className="text-xs font-semibold text-slate-800 break-words">
                            {answer.studentAnswer || <span className="text-slate-400 italic">No answer provided</span>}
                          </p>
                        </div>

                        {/* Expected / Correct Response */}
                        {answer.correctAnswer && (
                          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                            <span className="block text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mb-1">
                              Expected Answer / Solution
                            </span>
                            <p className="text-xs font-semibold text-emerald-900 break-words">
                              {answer.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Existing Teacher Feedback if any */}
                      {answer.teacherFeedback && (
                        <div className="mt-3 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl">
                          <p className="text-xs text-blue-900 font-medium">
                            <strong className="font-bold text-blue-700">Teacher feedback:</strong> {answer.teacherFeedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teacher Manual Grading / Override section for written questions */}
                  {answer.questionType === 'written' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/60 -mx-6 -mb-6 p-5 sm:p-6 rounded-b-2xl">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <span>✍️</span>
                          <span>Teacher Grading &amp; Review</span>
                        </h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleReviewAnswer(answer.id || answer.questionId, { isCorrect: true, points: answer.maxPoints ?? 1 })}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs"
                          >
                            ✓ Mark Correct
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewAnswer(answer.id || answer.questionId, { isCorrect: false, points: 0 })}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs"
                          >
                            ✕ Mark Incorrect
                          </button>
                        </div>
                      </div>
                      <textarea
                        placeholder="Add encouraging feedback or correction notes for the student..."
                        defaultValue={answer.teacherFeedback || ''}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-xs"
                        rows={2}
                        onBlur={(e) => {
                          if (e.target.value.trim() !== (answer.teacherFeedback || '')) {
                            handleReviewAnswer(answer.id || answer.questionId, {
                              isCorrect: answer.isCorrect,
                              points: answer.points,
                              teacherFeedback: e.target.value.trim()
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentResults;