import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lessonService } from '../services/lessonService';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const data = await lessonService.getLessons();
      setLessons(data);
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      await lessonService.deleteLesson(id);
      loadLessons();
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      alert('Failed to delete lesson');
    }
  };

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading lessons...</p>
        </div>
      </div>
    );
  }

  // Recherche souple : insensible casse/accents/espaces, tolère les approximations
  const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const isSubsequence = (target, query) => {
    let j = 0;
    for (let i = 0; i < target.length && j < query.length; i++) {
      if (target[i] === query[j]) j++;
    }
    return j === query.length;
  };
  const matches = (lesson) => {
    const q = normalize(search);
    if (!q) return true;
    const haystacks = [normalize(lesson.title), normalize(lesson.category)];
    return haystacks.some((h) => h.includes(q) || isSubsequence(h, q));
  };
  const filtered = lessons.filter(matches);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Lessons</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage, edit, and monitor all your created English lessons</p>
        </div>
        <Link
          to="/lessons/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
        >
          <span className="text-sm font-bold">+</span>
          <span>Create Lesson</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by lesson title or category..."
          className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg p-10 border border-slate-200 text-center">
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            {lessons.length === 0 ? 'No lessons yet' : 'No lessons match your search'}
          </h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            {lessons.length === 0
              ? 'Get started by creating your very first English lesson module'
              : 'Try searching for a different keyword or category name'}
          </p>
          {lessons.length === 0 && (
            <Link
              to="/lessons/create"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            >
              <span>+</span>
              <span>Create your first lesson</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Lesson</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Difficulty</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Class Codes</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{lesson.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {lesson.category || 'English'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {lesson.difficulty || 'Elementary'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          lesson.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : lesson.status === 'Draft'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${lesson.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {lesson.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        {(lesson.classes || []).map((cls) => (
                          <div key={cls.id} className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400">{cls.name}:</span>
                            <span className="font-mono bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold tabular-nums inline-flex items-center gap-1">
                              {cls.classCode || '...'}
                              {cls.classCode && (
                                <button
                                  type="button"
                                  onClick={() => copyCode(cls.classCode)}
                                  className="text-blue-500 hover:text-blue-700 ml-0.5"
                                  title="Copy code"
                                >
                                  {copiedCode === cls.classCode ? '✓' : '📋'}
                                </button>
                              )}
                            </span>
                          </div>
                        ))}
                        {(lesson.classes || []).length === 0 && (
                          <div>
                            <Link to="/classes" className="text-[11px] text-blue-600 hover:underline font-medium">
                              Assign to class →
                            </Link>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Primary Button */}
                        <Link
                          to={`/lessons/${lesson._id}/builder`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors"
                        >
                          Edit
                        </Link>
                        {/* Secondary Button */}
                        <Link
                          to={`/lessons/${lesson._id}/results`}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors"
                        >
                          Results
                        </Link>
                        {/* Delete Action */}
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          className="px-2 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md text-xs font-medium transition-colors"
                          title="Delete lesson"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lessons;