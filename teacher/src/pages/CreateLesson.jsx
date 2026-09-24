import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import { classService } from '../services/classService';

const CreateLesson = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'Active',
  });
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId');

  useEffect(() => {
    classService.getClasses().then(setAllClasses).catch(() => {});
  }, []);

  useEffect(() => {
    if (classId) setSelectedClasses([classId]);
  }, [classId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const lesson = await lessonService.createLesson(formData);
      const targets = [...new Set([...selectedClasses, ...(classId ? [classId] : [])])];
      if (targets.length > 0) {
        await Promise.all(
          targets.map((cid) => classService.attachLesson(cid, lesson._id).catch((e) => {
            console.error('Failed to attach lesson to class:', e);
          })),
        );
      }
      navigate(`/lessons/${lesson._id}/builder`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Lesson</h1>
        <p className="text-xs text-slate-500 mt-0.5">Fill in the details to create a new English learning module</p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200">
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Lesson Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              placeholder="e.g., Present Simple Grammar & Daily Routines"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none"
              placeholder="Describe what students will learn in this session"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
              placeholder="e.g., Grammar, Vocabulary, Reading..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assign to Classrooms
            </label>
            {allClasses.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500">
                No classes created yet. You can assign this lesson later from{' '}
                <span className="text-blue-600 font-semibold">My Classes</span>.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {allClasses.map((cls) => (
                  <label
                    key={cls._id}
                    className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls._id)}
                      onChange={(e) => {
                        setSelectedClasses(
                          e.target.checked
                            ? [...selectedClasses, cls._id]
                            : selectedClasses.filter((c) => c !== cls._id)
                        );
                      }}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-medium text-slate-800">{cls.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Lesson...' : 'Create Lesson & Open Builder →'}
            </button>
            {/* Secondary Action Button */}
            <button
              type="button"
              onClick={() => navigate('/lessons')}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLesson;