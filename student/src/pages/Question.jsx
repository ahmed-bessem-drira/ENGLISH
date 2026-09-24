import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import { answerService } from '../services/answerService';
import logoImg from '../assets/logo-transparent.png';

const Question = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadQuestion();
  }, [token]);

  const loadQuestion = async () => {
    try {
      const data = await lessonService.getCurrentQuestion(token);
      setQuestionData(data);
    } catch (error) {
      console.error('Failed to load question:', error);
      if (error.response?.status === 400) {
        navigate(`/session/${token}/result`);
      } else {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (feedback?.hasNextQuestion) {
      setSubmitting(false);
      setFeedback(null);
      setSelectedAnswer('');
      setWrittenAnswer('');
      loadQuestion();
    } else {
      navigate(`/session/${token}/result`);
    }
  };

  const handleSubmit = async () => {
    if (feedback) {
      handleNext();
      return;
    }

    if (!selectedAnswer && !writtenAnswer) {
      alert('Please choose or enter your answer.');
      return;
    }

    setSubmitting(true);
    try {
      const answer = questionData.question.type === 'multiple_choice' ? selectedAnswer : writtenAnswer;
      const data = await answerService.submitAnswer(token, {
        questionId: questionData.question.id,
        answer,
      });

      setFeedback({
        isCorrect: data.answer.isCorrect,
        points: data.answer.points,
        pendingReview: data.answer.pendingReview,
        correctAnswer: data.answer.correctAnswer,
        explanation: data.answer.explanation,
        suggestion: data.answer.suggestion,
        hasNextQuestion: data.hasNextQuestion,
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-xs font-medium">Loading next question...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = questionData?.totalQuestions || 0;
  const currentIndex = questionData?.currentIndex ?? 0;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const question = questionData?.question;

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Top Header / Brand */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <img src={logoImg} alt="Mr. Ben Salah" className="h-8 w-auto object-contain" />
            <span className="text-slate-200">|</span>
            <span className="font-bold text-[11px] text-blue-700 uppercase tracking-wider">Student Session</span>
          </div>

          <span className="px-2.5 py-0.5 rounded text-xs font-semibold tabular-nums bg-blue-50 text-blue-700 border border-blue-200">
            {question?.points ?? 0} {question?.points === 1 ? 'Point' : 'Points'}
          </span>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-7">
          {/* Progress Section */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span className="uppercase tracking-wider text-[11px] font-semibold">
                Question <span className="text-slate-900 font-bold tabular-nums">{currentIndex + 1}</span> of <span className="tabular-nums">{totalQuestions}</span>
              </span>
              <span className="tabular-nums font-semibold">{Math.round(progress)}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 rounded h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 mb-2">
              {question?.type === 'multiple_choice' ? 'Multiple Choice' : 'Written Response'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {question?.text}
            </h2>
          </div>

          {/* Answers Form */}
          {question?.type === 'multiple_choice' ? (
            <div className="space-y-2.5 mb-6">
              {(question.options || []).map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !feedback && !submitting && setSelectedAnswer(option)}
                    disabled={Boolean(feedback) || submitting}
                    className={`w-full p-3.5 rounded-md text-left border transition-colors flex items-center gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                    } ${submitting || feedback ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div
                      className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {letter}
                    </div>
                    <span className={`text-sm flex-1 ${isSelected ? 'font-semibold text-blue-950' : 'font-normal'}`}>
                      {option}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Type your answer below:
              </label>
              <textarea
                value={writtenAnswer}
                onChange={(e) => !feedback && setWrittenAnswer(e.target.value)}
                disabled={Boolean(feedback) || submitting}
                placeholder="Write your answer clearly..."
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none font-normal text-slate-800 text-sm placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`mb-5 p-4 rounded-md border text-xs leading-relaxed ${
                feedback.pendingReview
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5 font-bold">
                  {feedback.pendingReview ? 'ℹ️' : feedback.isCorrect ? '✓' : '✗'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm">
                      {feedback.pendingReview
                        ? 'Answer Submitted for Teacher Review'
                        : feedback.isCorrect
                        ? 'Correct Answer'
                        : 'Incorrect Answer'}
                    </p>
                    {!feedback.pendingReview && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded tabular-nums ${
                          feedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {feedback.points} pts
                      </span>
                    )}
                  </div>

                  {!feedback.pendingReview && !feedback.isCorrect && feedback.correctAnswer && (
                    <div className="mt-2 p-2.5 rounded bg-white border border-rose-200 text-xs">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px] mb-0.5">Correct Answer:</span>
                      <span className="text-emerald-700 font-bold">{feedback.correctAnswer}</span>
                    </div>
                  )}

                  {!feedback.pendingReview && feedback.explanation && (
                    <p className="text-xs text-slate-600 mt-2">
                      <strong className="text-slate-700">Explanation:</strong> {feedback.explanation}
                    </p>
                  )}

                  {feedback.pendingReview && (
                    <p className="text-xs text-blue-700 mt-1">
                      Your answer has been saved. Your teacher will evaluate it and assign your score.
                    </p>
                  )}

                  {feedback.pendingReview && feedback.suggestion && (
                    <div className="mt-2 p-2.5 rounded bg-white border border-blue-200 text-xs">
                      <strong className="text-blue-900 block mb-0.5">Suggested answer model:</strong>
                      <span className="text-blue-800">{feedback.suggestion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={handleSubmit}
            disabled={(submitting && !feedback) || (!feedback && !selectedAnswer && !writtenAnswer)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {feedback ? (
              feedback.hasNextQuestion ? (
                <>
                  <span>Next Question</span>
                  <span>→</span>
                </>
              ) : (
                <>
                  <span>See Final Results</span>
                  <span>→</span>
                </>
              )
            ) : submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking Answer...</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question;