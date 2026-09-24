import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import { questionService } from '../services/questionService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await lessonService.getLessons();
      const enrichedLessons = await Promise.all(
        data.map(async (lesson) => {
          try {
            const questions = await questionService.getQuestionsByLesson(lesson._id);
            return { ...lesson, questionCount: questions?.length || 0 };
          } catch {
            return { ...lesson, questionCount: 0 };
          }
        })
      );
      setLessons(enrichedLessons);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = {
    totalLessons: lessons.length,
    totalQuestions: lessons.reduce((sum, l) => sum + (l.questionCount || 0), 0),
    totalClasses: new Set(lessons.flatMap((l) => (l.classes || []).map((c) => c.id || c._id))).size,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading your classroom dashboard...</p>
        </div>
      </div>
    );
  }

  const teacherFirstName = user?.name ? user.name.split(' ')[0] : 'Professor';

  return (
    <div className="max-w-[1600px] mx-auto space-y-7">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {getGreeting()},{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {teacherFirstName}
              </span>
              !
            </h1>
            <span className="text-2xl inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
            Manage your English courses, monitor student submissions, and launch interactive sessions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/lessons/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-base font-extrabold leading-none">+</span>
            <span>Create New Lesson</span>
          </Link>
        </div>
      </div>

      {/* Decorative Motivation Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071329] via-[#0b2450] to-[#123e85] p-6 sm:p-9 text-white shadow-2xl shadow-blue-950/20 border border-blue-500/20">
        {/* Background ambient decorative glow orbs & grid */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Ambient geometric background grid/lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Column: Titles & Action Buttons */}
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Ready to challenge your <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-200 bg-clip-text text-transparent">students today?</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Create engaging multiple-choice and written exercises. Students can join instantly with a 6-character class code, answer in real-time, and receive instant feedback.
            </p>

            {/* In-Banner Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/lessons/create"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-base font-extrabold leading-none">+</span>
                <span>Build New Module</span>
                <span className="text-sm">→</span>
              </Link>

              <Link
                to="/classes"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4.5 py-3 rounded-xl backdrop-blur-md border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>🏫</span>
                <span>Manage Class Cohorts</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Sleek Glassmorphic Live Indicator Widget */}
          <div className="relative hidden lg:flex flex-col gap-3 min-w-[290px]">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide">Classroom Hub</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                  LIVE &amp; READY
                </span>
              </div>

              {/* Mini Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="block text-xl font-black text-cyan-300 tabular-nums">{stats.totalLessons}</span>
                  <span className="text-[10px] text-slate-300 font-medium">Published Lessons</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="block text-xl font-black text-indigo-300 tabular-nums">{stats.totalQuestions}</span>
                  <span className="text-[10px] text-slate-300 font-medium">Active Tasks</span>
                </div>
              </div>

              {/* Bottom Feature Pill */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5 font-medium">
                  <span>⚡</span>
                  <span>Instant 6-Char PIN Join</span>
                </span>
                <span className="text-cyan-300 font-mono font-extrabold tracking-wider">SYNC ON</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Stat Cards Grid (3 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Lessons */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Total Lessons</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">{stats.totalLessons}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              ● Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            <span>📚</span>
            <span>Modules ready for students</span>
          </p>
        </div>

        {/* Total Questions */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Total Questions</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">{stats.totalQuestions}</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
              Tasks
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            <span>✍️</span>
            <span>MCQs and written exercises</span>
          </p>
        </div>

        {/* Classes Cohorts */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Cohorts</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600 tabular-nums tracking-tight">{stats.totalClasses}</span>
            <span className="text-xs text-slate-400 font-semibold">classes</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            <span>🏫</span>
            <span>Assigned student groups</span>
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
        {/* Left Column: Recent Lessons */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Lessons</h2>
                  <p className="text-xs text-slate-400">Created modules and classroom distribution</p>
                </div>
              </div>

              <Link
                to="/lessons"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                View all lessons →
              </Link>
            </div>

            {/* Lessons List (Always latest 3) or Empty State */}
            {lessons.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center bg-slate-50/50">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-2xl">
                  📚
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">No lessons created yet</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                  Create your first interactive English lesson to share with your students.
                </p>
                <Link
                  to="/lessons/create"
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  <span>+</span>
                  <span>Create your first lesson</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {lessons.slice(0, 3).map((lesson) => (
                  <div
                    key={lesson._id}
                    className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative group bg-white"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Title & Status */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {lesson.title || 'Untitled Lesson'}
                        </h4>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          lesson.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${lesson.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {lesson.status}
                        </span>
                      </div>

                      {/* Badges & Meta */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {lesson.category || 'English'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                          {lesson.difficulty || 'Elementary'}
                        </span>
                        <span className="text-slate-400 text-xs">&middot;</span>
                        <span className="text-slate-500 text-xs tabular-nums font-medium">
                          {lesson.questionCount || 0} questions
                        </span>

                        {/* Access Code Chip */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Code</span>
                          <span className="font-mono font-bold text-blue-700 text-xs tabular-nums">
                            {lesson.accessCode || '—'}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(lesson.accessCode, lesson._id)}
                            className="text-slate-400 hover:text-blue-600 transition-colors ml-0.5 p-0.5 relative"
                            title="Copy access code"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {copiedId === lesson._id && (
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                                Copied!
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <Link
                        to={`/lessons/${lesson._id}/results`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        Results
                      </Link>

                      <Link
                        to={`/lessons/${lesson._id}/builder`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                      >
                        Edit
                      </Link>

                      {/* Options Dropdown */}
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === lesson._id ? null : lesson._id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>

                      {activeMenuId === lesson._id && (
                        <div className="absolute right-4 top-14 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20">
                          <Link
                            to={`/lessons/${lesson._id}/builder`}
                            className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            ✏️ Edit Questions
                          </Link>
                          <Link
                            to={`/lessons/${lesson._id}/results`}
                            className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            📊 View Results & Grades
                          </Link>
                          <button
                            onClick={() => copyToClipboard(lesson.accessCode, lesson._id)}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            📋 Copy Access Code
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions & Live Tip */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">⚡</span>
              <span>Quick Actions</span>
            </h3>

            <div className="space-y-2.5">
              <Link
                to="/lessons/create"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-between shadow-md shadow-blue-500/20 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-extrabold">+</span>
                  <span>Create New Lesson</span>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                to="/classes"
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-purple-600">🏫</span>
                  <span>Manage Classrooms</span>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                to="/lessons"
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-blue-500">📚</span>
                  <span>Browse All Lessons</span>
                </div>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Classroom Live Tip Card */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-2xl p-5 border border-blue-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Classroom Live Tip
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Project your teacher screen or share the 6-character access code with your students. As students complete the tasks, visit <strong>Results</strong> to review their open-ended written responses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;