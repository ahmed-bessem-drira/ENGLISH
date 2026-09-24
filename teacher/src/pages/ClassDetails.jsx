import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { classService } from '../services/classService';
import { lessonService } from '../services/lessonService';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attachId, setAttachId] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [cls, lessons] = await Promise.all([
        classService.getClass(id),
        lessonService.getLessons(),
      ]);
      setClassData(cls);
      setAllLessons(lessons);
    } catch (error) {
      console.error('Failed to load class:', error);
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleAttach = async () => {
    if (!attachId) return;
    try {
      await classService.attachLesson(id, attachId);
      setAttachId('');
      loadData();
    } catch (error) {
      console.error('Failed to attach lesson:', error);
      alert('Failed to attach lesson');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied: ' + code);
  };

  const handleRegenerateCode = async (lessonId) => {
    if (!window.confirm('Generate a new code for this lesson in this class? The old code will stop working.')) {
      return;
    }
    try {
      await classService.regenerateCode(id, lessonId);
      loadData();
    } catch (error) {
      console.error('Failed to regenerate code:', error);
      alert('Failed to regenerate code');
    }
  };

  const handleDetach = async (lessonId) => {
    if (!window.confirm('Remove this lesson from the class? (The lesson itself is kept.)')) {
      return;
    }
    try {
      await classService.detachLesson(id, lessonId);
      loadData();
    } catch (error) {
      console.error('Failed to remove lesson:', error);
      alert('Failed to remove lesson');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading classroom details...</p>
        </div>
      </div>
    );
  }

  const attachedIds = new Set((classData?.lessons || []).map((l) => String(l._id)));
  const availableLessons = allLessons.filter((l) => !attachedIds.has(String(l._id)));

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <Link to="/classes" className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
        ← Back to Classes
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{classData?.name}</h1>
          {classData?.description && <p className="text-xs text-slate-500 mt-0.5">{classData.description}</p>}
        </div>
        <Link
          to={`/lessons/create?classId=${id}`}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors"
        >
          <span>+</span>
          <span>Create Lesson in this Class</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg p-5 border border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Add an existing lesson</h2>
        <p className="text-xs text-slate-500 mb-3">
          Attach a lesson to this cohort so students can join with class-specific codes.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <select
            value={attachId}
            onChange={(e) => setAttachId(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Select a lesson...</option>
            {availableLessons.map((l) => (
              <option key={l._id} value={l._id}>
                {l.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleAttach}
            disabled={!attachId}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Attach Lesson
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Lessons ({classData?.lessons?.length || 0})
          </h2>
        </div>

        {(classData?.lessons?.length || 0) === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-sm font-bold text-slate-800 mb-1">No lessons in this class</h3>
            <p className="text-xs text-slate-500">Create one above or attach an existing lesson module.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {classData.lessons.map((lesson) => (
              <div key={lesson._id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-xs text-slate-900">{lesson.title}</p>
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                      lesson.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {lesson.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-0.5">
                    Class code:{' '}
                    <span className="font-mono bg-blue-50 border border-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded text-xs tabular-nums">
                      {lesson.classCode || '...'}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Students joining with this code are tagged with class “{classData?.name}”.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyCode(lesson.classCode)}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                  >
                    Copy code
                  </button>
                  <button
                    onClick={() => handleRegenerateCode(lesson._id)}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 text-amber-700 hover:bg-amber-50 text-xs font-semibold transition-colors"
                  >
                    New code
                  </button>
                  <Link
                    to={`/lessons/${lesson._id}/builder`}
                    className="px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/lessons/${lesson._id}/results?classId=${id}`}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                  >
                    Results
                  </Link>
                  <button
                    onClick={() => handleDetach(lesson._id)}
                    className="px-2.5 py-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;
