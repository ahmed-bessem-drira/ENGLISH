import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import logoImg from '../assets/logo-transparent.png';

const SessionStart = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    loadSession();
  }, [token]);

  const loadSession = async () => {
    try {
      const data = await lessonService.getSession(token);
      setSessionData(data);
    } catch (error) {
      console.error('Failed to load session:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      await lessonService.startSession(token);
      navigate(`/session/${token}/question`);
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start lesson. Please try again.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs font-medium">Preparing lesson workspace...</p>
        </div>
      </div>
    );
  }

  const lesson = sessionData?.lesson;
  const student = sessionData?.student;
  const classroom = sessionData?.class;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fb] px-4 py-12">
      <div className="max-w-[460px] w-full">
        {/* Brand Header with Professor Logo */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img
            src={logoImg}
            alt="Mr. Ben Salah - English Professor"
            className="h-18 sm:h-24 w-auto object-contain mb-3"
          />
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Lesson Ready
            </span>
          </div>
        </div>

        {/* Lesson Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-7">
          {/* Header Title */}
          <div className="text-center mb-6">
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 mb-2">
              {lesson?.category || 'General English'} &middot; {lesson?.difficulty || 'Elementary'}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{lesson?.title || 'Interactive Lesson'}</h1>
            {lesson?.description && (
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{lesson.description}</p>
            )}
          </div>

          {/* Student Info Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {student?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{student?.name}</p>
                <p className="text-[11px] text-slate-400">Student</p>
              </div>
            </div>

            {classroom && (
              <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-white border border-slate-200 text-slate-600">
                Class: {classroom.name}
              </span>
            )}
          </div>

          {/* Numerical Hero Elements - Strong visual hierarchy with tabular numerals */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total Questions</span>
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums block">
                {sessionData?.totalQuestions || 0}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Tasks to solve</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Access Code</span>
              <span className="text-2xl font-bold font-mono text-blue-600 tabular-nums block mt-1 tracking-wider">
                {lesson?.accessCode || '—'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Verified</span>
            </div>
          </div>

          {/* Action Buttons: Clear Primary and Secondary */}
          <div className="space-y-2.5">
            {/* Primary Action Button */}
            <button
              onClick={handleStart}
              disabled={starting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading Questions...</span>
                </>
              ) : (
                <>
                  <span>Start Lesson Now</span>
                  <span>→</span>
                </>
              )}
            </button>

            {/* Secondary Action Button */}
            <button
              onClick={() => navigate('/')}
              disabled={starting}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-md font-semibold text-xs transition-colors text-center"
            >
              Back to Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionStart;