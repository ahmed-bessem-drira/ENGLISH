import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import { questionService } from '../services/questionService';
import { classService } from '../services/classService';

const LessonBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    expectedAnswer: '',
    points: 1,
    correction: '',
    explanation: '',
  });

  useEffect(() => {
    loadLessonData();
  }, [id]);

  const loadLessonData = async () => {
    try {
      const [lessonData, questionsData, classesData] = await Promise.all([
        lessonService.getLesson(id),
        questionService.getQuestionsByLesson(id),
        classService.getClasses(),
      ]);
      setLesson(lessonData);
      setQuestions(questionsData);
      setAllClasses(classesData);
    } catch (error) {
      console.error('Failed to load lesson:', error);
      navigate('/lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      if (editingQuestion) {
        await questionService.updateQuestion(editingQuestion._id, newQuestion);
      } else {
        await questionService.createQuestion({ ...newQuestion, lessonId: id });
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      setNewQuestion({
        type: 'multiple_choice',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        expectedAnswer: '',
        points: 1,
        correction: '',
        explanation: '',
      });
      loadLessonData();
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question');
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setNewQuestion({
      type: question.type,
      text: question.text,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer || '',
      expectedAnswer: question.expectedAnswer || '',
      points: question.points,
      correction: question.correction || '',
      explanation: question.explanation || '',
    });
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await questionService.deleteQuestion(questionId);
      loadLessonData();
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('Failed to delete question');
    }
  };

  const handleActivateLesson = async () => {
    try {
      await lessonService.updateLesson(id, { status: 'Active' });
      loadLessonData();
    } catch (error) {
      console.error('Failed to activate lesson:', error);
      alert('Failed to activate lesson');
    }
  };

  const handleToggleClass = async (classId, attached) => {
    try {
      if (attached) {
        await classService.detachLesson(classId, id);
      } else {
        await classService.attachLesson(classId, id);
      }
      const classesData = await classService.getClasses();
      setAllClasses(classesData);
    } catch (error) {
      console.error('Failed to update class assignment:', error);
      alert('Failed to update class assignment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading lesson builder &amp; questions...</p>
        </div>
      </div>
    );
  }

  const optionColors = [
    { label: 'A', bg: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'B', bg: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { label: 'C', bg: 'bg-purple-50 text-purple-600 border-purple-200' },
    { label: 'D', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-7">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/lessons"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 mb-2.5"
          >
            <span>←</span>
            <span>Back to Lessons</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lesson?.title || 'Lesson Builder'}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold rounded-full ${
              lesson?.status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : lesson?.status === 'Draft'
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${lesson?.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {lesson?.status}
            </span>

            {lesson?.status !== 'Active' && (
              <button
                onClick={handleActivateLesson}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all"
              >
                <span>⚡</span>
                <span>Publish &amp; Activate</span>
              </button>
            )}
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Build exercise questions, assign cohort access codes, and customize grading criteria.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={`/lessons/${id}/results`}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all"
          >
            <span>📊</span>
            <span>View Results</span>
          </Link>

          <button
            onClick={() => {
              setEditingQuestion(null);
              setNewQuestion({
                type: 'multiple_choice',
                text: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                expectedAnswer: '',
                points: 1,
                correction: '',
                explanation: '',
              });
              setShowQuestionModal(true);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-4.5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-base font-extrabold leading-none">+</span>
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Cohort Class Assignments Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              🏫
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Assigned Classes &amp; Cohorts</h2>
              <p className="text-xs text-slate-400">
                Link this module to student classes to generate class-specific 6-character access codes.
              </p>
            </div>
          </div>
          <Link to="/classes" className="text-xs font-bold text-blue-600 hover:underline">
            Manage Classes →
          </Link>
        </div>

        {allClasses.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 mt-4">
            No classrooms created yet. <Link to="/classes" className="text-blue-600 font-bold hover:underline">Create your first class cohort →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {allClasses.map((cls) => {
              const attached = (cls.lessonIds || []).includes(id);
              const code = cls.lessonCodes?.[id];
              return (
                <label
                  key={cls._id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    attached
                      ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={attached}
                      onChange={() => handleToggleClass(cls._id, attached)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-blue-600 cursor-pointer"
                    />
                    <span className={`text-xs font-bold ${attached ? 'text-slate-900' : 'text-slate-600'}`}>
                      {cls.name}
                    </span>
                  </div>
                  {attached && code && (
                    <span className="font-mono bg-blue-600 text-white font-black px-2 py-0.5 rounded text-[11px] tracking-wider shadow-2xs">
                      {code}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Questions List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              ✍️
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Question Bank ({questions.length})
              </h2>
              <p className="text-xs text-slate-400">Manage all interactive prompts and grading criteria</p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingQuestion(null);
              setNewQuestion({
                type: 'multiple_choice',
                text: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                expectedAnswer: '',
                points: 1,
                correction: '',
                explanation: '',
              });
              setShowQuestionModal(true);
            }}
            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
          >
            <span>+</span>
            <span>Add Question</span>
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="p-12 sm:p-16 text-center">
            <div className="w-18 h-18 rounded-3xl bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
              ❓
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">No questions added yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
              Create multiple-choice or written exercises for your students.
            </p>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setNewQuestion({
                  type: 'multiple_choice',
                  text: '',
                  options: ['', '', '', ''],
                  correctAnswer: '',
                  expectedAnswer: '',
                  points: 1,
                  correction: '',
                  explanation: '',
                });
                setShowQuestionModal(true);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition-all"
            >
              <span>+ Add your first question</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {questions.map((question, index) => (
              <div key={question._id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Badges bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                        {index + 1}
                      </span>
                      <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 text-slate-700">
                        {question.type === 'multiple_choice' ? 'Multiple Choice' : 'Written Answer'}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-md">
                        {question.points || 1} pt{question.points > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Question text */}
                    <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {question.text}
                    </p>

                    {/* MCQ Options list */}
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {question.options.map((option, i) => {
                          const isCorrect = option === question.correctAnswer;
                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border ${
                                isCorrect
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold'
                                  : 'bg-slate-50 border-slate-200/70 text-slate-600'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                                isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="truncate">{option || <em className="text-slate-400">Empty</em>}</span>
                              {isCorrect && (
                                <span className="ml-auto text-emerald-600 font-bold text-xs">✓ Correct</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Written Answer Solution */}
                    {question.type === 'written' && question.expectedAnswer && (
                      <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs">
                        <span className="font-bold text-emerald-800">Expected Answer: </span>
                        <span className="text-emerald-900">{question.expectedAnswer}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start pt-1">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors"
                    >
                      <span>🗑</span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Redesigned Question Edit / Add Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {editingQuestion ? '✏️' : '✨'}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {editingQuestion ? 'Edit Question' : 'Create New Question'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure question prompt, answer choices, and scoring points
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  setEditingQuestion(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6 overflow-y-auto">
              {/* Question Type - Interactive Segmented Selector */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  Question Format
                </label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setNewQuestion({ ...newQuestion, type: 'multiple_choice' })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      newQuestion.type === 'multiple_choice'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🔘</span>
                    <span>Multiple Choice (MCQ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewQuestion({ ...newQuestion, type: 'written' })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      newQuestion.type === 'written'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>✍️</span>
                    <span>Written Response</span>
                  </button>
                </div>
              </div>

              {/* Question Textarea */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  Question Prompt
                </label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all shadow-2xs"
                  placeholder="e.g. Choose the correct form of the verb to complete the sentence..."
                />
              </div>

              {/* MCQ Options with color badges and quick correct answer toggle */}
              {newQuestion.type === 'multiple_choice' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Answer Choices
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Select the correct option below
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {newQuestion.options.map((option, index) => {
                      const color = optionColors[index] || optionColors[0];
                      const isCorrect = newQuestion.correctAnswer === option && option !== '';

                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2.5 p-2 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-8 h-9 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${color.bg}`}>
                            {color.label}
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const val = e.target.value;
                              const oldVal = newQuestion.options[index];
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = val;
                              let newCorrect = newQuestion.correctAnswer;
                              if (newCorrect === oldVal) {
                                newCorrect = val;
                              }
                              setNewQuestion({ ...newQuestion, options: newOptions, correctAnswer: newCorrect });
                            }}
                            className="flex-1 px-3 py-1.5 bg-transparent border-none text-xs sm:text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
                            placeholder={`Option ${color.label} text...`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (option) {
                                setNewQuestion({ ...newQuestion, correctAnswer: option });
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : option
                                ? 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700'
                                : 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isCorrect ? '✓ Correct Answer' : 'Set as Correct'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Written Question Expected Answer */}
              {newQuestion.type === 'written' && (
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Expected Answer / Reference Solution (Optional)
                  </label>
                  <textarea
                    value={newQuestion.expectedAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, expectedAnswer: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all shadow-2xs"
                    placeholder="Provide sample correct response or keywords..."
                  />
                </div>
              )}

              {/* Points & Hints Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Points Allocated
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newQuestion.points}
                      onChange={(e) => setNewQuestion({ ...newQuestion, points: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1"
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <span className="text-xs text-slate-500 font-semibold shrink-0">pt(s)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Explanation / Hint (Optional)
                  </label>
                  <input
                    type="text"
                    value={newQuestion.correction || ''}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correction: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Short grammar note..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowQuestionModal(false);
                  setEditingQuestion(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-white hover:border-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                disabled={!newQuestion.text.trim() || (newQuestion.type === 'multiple_choice' && !newQuestion.correctAnswer)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {editingQuestion ? 'Update Question' : 'Save Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonBuilder;