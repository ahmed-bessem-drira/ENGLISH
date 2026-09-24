import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinService } from '../services/joinService';
import logoImg from '../assets/logo-transparent.png';

const Join = () => {
  const [formData, setFormData] = useState({
    accessCode: '',
    studentName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'accessCode' ? value.toUpperCase().replace(/[^A-Z0-9]/g, '') : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await joinService.joinLesson({
        accessCode: formData.accessCode.trim(),
        studentName: formData.studentName.trim(),
      });
      navigate(`/session/${data.sessionToken}`);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg || 'Failed to join lesson. Please verify the code with your teacher.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fb] px-4 py-12">
      <div className="max-w-[420px] w-full">
        {/* Brand Header with Professor Logo */}
        <div className="text-center mb-7 flex flex-col items-center">
          <img
            src={logoImg}
            alt="Mr. Ben Salah - English Professor"
            className="h-20 sm:h-28 w-auto object-contain mb-4"
          />
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Interactive Student Portal
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Join Your Lesson</h1>
          <p className="text-slate-500 text-xs mt-1">Enter the access code provided by your teacher to begin</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-7">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs flex items-start gap-2.5">
              <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1 font-medium leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Lesson Access Code
              </label>
              <input
                type="text"
                name="accessCode"
                value={formData.accessCode}
                onChange={handleChange}
                required
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.3em] uppercase bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:font-normal text-slate-900 tabular-nums"
                placeholder="e.g. 449ECM"
                autoComplete="off"
              />
              <p className="text-[11px] text-slate-400 mt-1 text-center">6-character lesson code</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. Sarah Connor"
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading || !formData.accessCode.trim() || !formData.studentName.trim()}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Joining Lesson...</span>
                </>
              ) : (
                <>
                  <span>Join Lesson</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Help Tip */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Ask your teacher if you don't have an access code</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          English Classroom &middot; Interactive Learning Portal
        </p>
      </div>
    </div>
  );
};

export default Join;