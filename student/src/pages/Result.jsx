import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import logoImg from '../assets/logo-transparent.png';

const Result = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [review, setReview] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    completeSession();
  }, [token]);

  const completeSession = async () => {
    try {
      const data = await lessonService.completeSession(token);
      setResult(data);
      try {
        const sessionData = await lessonService.getSession(token);
        setStudentName(sessionData?.student?.name || '');
      } catch (nameError) {
        console.error('Failed to load student name:', nameError);
      }
      try {
        const reviewData = await lessonService.getReview(token);
        setReview(reviewData);
      } catch (reviewError) {
        console.error('Failed to load review:', reviewError);
      }
    } catch (error) {
      console.error('Failed to complete session:', error);
      setErrorMsg('Session not found or already completed. Please enter a valid class code to start a new session.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs font-medium">Calculating final score...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200/80 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-slate-900">Session Completed or Expired</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {errorMsg}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            ← Return to Classroom Join Page
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = result?.result?.pendingCount || 0;

  const statusOf = (item) => {
    if (item.studentAnswer == null) return 'unanswered';
    if (item.pendingReview) return 'pending';
    return item.isCorrect ? 'correct' : 'incorrect';
  };

  const statusBadge = (status) => {
    if (status === 'correct') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
          ✓ Correct
        </span>
      );
    }
    if (status === 'incorrect') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded bg-rose-50 text-rose-700 border border-rose-200">
          ✗ Incorrect
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">
          Under Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 text-slate-500">
        Skipped
      </span>
    );
  };

  const percentage = result?.result?.percentage ?? 0;
  const isGreatScore = percentage >= 70;

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Brand Header with Professor Logo */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center px-4 py-2.5 bg-white rounded-2xl shadow-xs border border-slate-200/80 mb-2.5">
            <img src={logoImg} alt="Mr. Ben Salah - English Professor" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Session Completed
            </span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-7 text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {pendingCount > 0 ? 'Lesson Finished' : isGreatScore ? 'Lesson Completed: High Score' : 'Lesson Completed'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {studentName ? `${studentName} · ` : ''}Results Summary
          </p>

          {/* Pending Review alert or Score stats - Hero Numbers */}
          {pendingCount > 0 ? (
            <div className="my-5 p-4 bg-blue-50 border border-blue-200 rounded-md text-left flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-0.5">ℹ️</span>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-xs">Teacher Review in Progress</p>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  <span className="tabular-nums font-semibold">{pendingCount}</span> written response{pendingCount > 1 ? 's are' : ' is'} awaiting teacher evaluation.
                  Official score will be updated once reviewed.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Score</span>
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {result?.result?.earnedPoints}/{result?.result?.totalPoints}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Points</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Accuracy</span>
                <span className="text-3xl font-extrabold text-blue-600 tabular-nums">
                  {result?.result?.percentage}%
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Total</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Correct</span>
                <span className="text-3xl font-extrabold text-emerald-600 tabular-nums">
                  {result?.result?.correctCount}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Answers</span>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold text-xs transition-colors"
          >
            <span>Join Another Lesson</span>
            <span>→</span>
          </button>
        </div>

        {/* Answers Review Section */}
        {review.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Answer Review</h2>
                <p className="text-xs text-slate-400 mt-0.5">Detailed breakdown of answers and feedback</p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold tabular-nums bg-slate-100 text-slate-700">
                {review.length} items
              </span>
            </div>

            <div className="space-y-3">
              {review.map((item, index) => {
                const status = statusOf(item);
                return (
                  <div
                    key={item.questionId}
                    className="p-4 rounded-md bg-slate-50 border border-slate-200 text-left transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="w-5 h-5 rounded bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center tabular-nums">
                        {index + 1}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-white border border-slate-200 text-slate-600">
                        {item.type === 'multiple_choice' ? 'Multiple Choice' : 'Written'}
                      </span>
                      {statusBadge(status)}
                      <span className="ml-auto text-xs font-semibold text-slate-500 tabular-nums">
                        {item.points ?? 0}/{item.maxPoints} pts
                      </span>
                    </div>

                    <p className="text-slate-900 font-semibold text-xs mb-2.5">{item.text}</p>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded bg-white border border-slate-200">
                        <span className="font-semibold text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Your Answer:</span>
                        <span className="text-slate-900 font-medium">{item.studentAnswer ?? '—'}</span>
                      </div>

                      {item.type === 'multiple_choice' && item.correctAnswer && (
                        <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
                          <span className="font-semibold text-emerald-800 block text-[10px] uppercase tracking-wider mb-0.5">Correct Answer:</span>
                          <span className="text-emerald-700 font-bold">{item.correctAnswer}</span>
                        </div>
                      )}

                      {item.type === 'multiple_choice' && item.explanation && (
                        <div className="text-slate-600 text-xs px-1">
                          <strong className="text-slate-700">Explanation:</strong> {item.explanation}
                        </div>
                      )}

                      {item.type === 'written' && item.suggestion && (
                        <div className="p-2.5 rounded bg-blue-50 border border-blue-200">
                          <span className="font-semibold text-blue-900 block text-[10px] uppercase tracking-wider mb-0.5">Suggested Model:</span>
                          <span className="text-blue-800 font-normal">{item.suggestion}</span>
                        </div>
                      )}

                      {item.teacherFeedback && (
                        <div className="p-2.5 bg-blue-50 rounded border border-blue-200 mt-2">
                          <span className="font-bold text-blue-900 block text-[10px] uppercase mb-0.5">Teacher Feedback:</span>
                          <span className="text-blue-800 text-xs">{item.teacherFeedback}</span>
                        </div>
                      )}

                      {status === 'pending' && !item.teacherFeedback && (
                        <div className="text-blue-700 text-xs font-medium px-1 pt-1">
                          Awaiting teacher review and grading.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
