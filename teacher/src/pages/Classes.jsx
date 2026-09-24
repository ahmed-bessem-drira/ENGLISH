import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classService } from '../services/classService';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await classService.getClasses();
      setClasses(data);
    } catch (err) {
      console.error('Failed to load classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: '', description: '' });
    setError('');
    setShowForm(true);
  };

  const openEdit = (cls) => {
    setEditing(cls);
    setFormData({ name: cls.name, description: cls.description || '' });
    setError('');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await classService.updateClass(editing._id, formData);
      } else {
        await classService.createClass(formData);
      }
      setShowForm(false);
      loadClasses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save class');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class? Lessons inside it will NOT be deleted.')) {
      return;
    }
    try {
      await classService.deleteClass(id);
      loadClasses();
    } catch (err) {
      console.error('Failed to delete class:', err);
      alert('Failed to delete class');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Classes</h1>
          <p className="text-xs text-slate-500 mt-0.5">Organize your lessons by student groups, classes, and levels</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
        >
          <span className="text-sm font-bold">+</span>
          <span>New Class</span>
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-lg p-10 border border-slate-200 text-center">
          <h3 className="text-sm font-bold text-slate-800 mb-1">No classes yet</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            Create your first class group, then attach lesson modules and invite students.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
          >
            <span>+</span>
            <span>Create your first class</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white rounded-lg p-5 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{cls.name}</h3>
                  <span className="px-2 py-0.5 text-[11px] font-semibold tabular-nums rounded bg-slate-100 text-slate-700">
                    {cls.lessonCount || 0} lesson{(cls.lessonCount || 0) === 1 ? '' : 's'}
                  </span>
                </div>
                {cls.description ? (
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{cls.description}</p>
                ) : (
                  <p className="text-xs text-slate-400 italic mb-4">No description provided</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Link
                  to={`/classes/${cls._id}`}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Open Class</span>
                  <span>→</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(cls)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="text-xs font-medium text-slate-400 hover:text-rose-600 px-2.5 py-1.5 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-5 pb-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                {editing ? 'Edit Class' : 'Create New Class'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Group and manage your lessons for a cohort</p>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Class Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Computer Science 1st Year, Master A..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Optional brief description of this classroom"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
