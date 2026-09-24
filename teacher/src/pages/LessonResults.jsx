import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { lessonService } from '../services/lessonService';
import { resultService } from '../services/resultService';
import { classService } from '../services/classService';
import { questionService } from '../services/questionService';
import ConfirmModal from '../components/ConfirmModal';

const LessonResults = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId');
  const [lesson, setLesson] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadResults();
  }, [id, classId]);

  const loadResults = async () => {
    try {
      const [lessonData, resultsData] = await Promise.all([
        lessonService.getLesson(id),
        resultService.getLessonResults(id, classId || undefined),
      ]);
      setLesson(lessonData);
      setResults(resultsData);
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-medium">Loading lesson analytics &amp; student submissions...</p>
        </div>
      </div>
    );
  }

  const handleExportPdf = async () => {
    if (!results || results.results.length === 0) {
      alert('No results to export');
      return;
    }
    setExporting(true);
    try {
      // Detail par session : toutes les reponses de tous les eleves, question par question
      const details = await Promise.all(
        results.results.map(async (r) => {
          try {
            const d = await resultService.getSessionDetails(id, r.sessionId);
            return { result: r, detail: d };
          } catch (e) {
            console.error('Failed to load details for', r.sessionId, e);
            return { result: r, detail: null };
          }
        }),
      );

      // Regrouper par classe (ordre alphabetique, "sans classe" a la fin), eleves par ordre alphabetique
      const NO_CLASS = 'No class';
      const byClass = {};
      details.forEach(({ result: r, detail }) => {
        const className = r.className || NO_CLASS;
        if (!byClass[className]) byClass[className] = [];
        byClass[className].push({ result: r, detail });
      });
      const orderedClasses = Object.keys(byClass).sort((a, b) => {
        if (a === NO_CLASS) return 1;
        if (b === NO_CLASS) return -1;
        return a.localeCompare(b);
      });
      orderedClasses.forEach((c) => {
        byClass[c].sort((x, y) => x.result.studentName.localeCompare(y.result.studentName));
      });

      // Page de garde : lecon, classes destinataires, questions
      const [classesData, questionsData] = await Promise.all([
        classService.getClasses(),
        questionService.getQuestionsByLesson(id),
      ]);
      const targetClasses = classesData.filter((c) => (c.lessonIds || []).includes(id));

      const doc = new jsPDF();
      let y = 20;
      doc.setFontSize(18);
      doc.text(`${lesson?.title || 'Lesson'}`, 14, y);
      y += 8;
      if (lesson?.description) {
        doc.setFontSize(11);
        doc.text(doc.splitTextToSize(lesson.description, 180), 14, y);
        y += 7;
      }
      doc.setFontSize(11);
      doc.text(`Exported: ${new Date().toLocaleString()}`, 14, y);
      y += 10;

      doc.setFontSize(14);
      doc.text('Assigned classes:', 14, y);
      y += 7;
      doc.setFontSize(11);
      if (targetClasses.length === 0) {
        doc.text('- No class (general code only)', 14, y);
        y += 7;
      } else {
        targetClasses.forEach((c) => {
          const code = c.lessonCodes?.[id] || '';
          doc.text(`- ${c.name}${code ? `  (code: ${code})` : ''}`, 14, y);
          y += 7;
        });
      }
      y += 5;

      doc.setFontSize(14);
      doc.text('Questions:', 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [['#', 'Question', 'Type', 'Options / Expected answer', 'Pts']],
        body: (questionsData || []).map((q, i) => [
          String(i + 1),
          q.text || '',
          q.type === 'multiple_choice' ? 'MCQ' : 'Written',
          q.type === 'multiple_choice'
            ? `Options: ${(q.options || []).join(' | ')}  —  Correct answer: ${q.correctAnswer || '-'}`
            : (q.expectedAnswer || q.correction || '-'),
          String(q.points ?? 1),
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 8 }, 2: { cellWidth: 16 }, 4: { cellWidth: 12 } },
      });
      y = doc.lastAutoTable.finalY + 12;

      // Pages suivantes : reponses des eleves, classe par classe
      doc.addPage();
      y = 20;
      orderedClasses.forEach((className) => {
        if (y > 40) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(15);
        doc.text(`Class: ${className}`, 14, y);
        y += 10;

        byClass[className].forEach(({ result: r, detail }) => {
          const answers = detail?.answers || [];
          if (y > 230) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(12);
          doc.text(`Student: ${r.studentName}`, 14, y);
          y += 7;

          if (answers.length === 0) {
            doc.setFontSize(10);
            doc.text('No answers submitted.', 14, y);
            y += 10;
            return;
          }
          answers.forEach((a, i) => {
            const written = a.questionType === 'written';
            doc.setFontSize(10);
            const qLines = doc.splitTextToSize(`Q${i + 1}: ${a.questionText || ''}`, 180);
            if (y + qLines.length * 5 + 10 > 275) {
              doc.addPage();
              y = 20;
            }
            doc.text(qLines, 14, y);
            y += qLines.length * 5 + 2;

            const rows = [['Student answer', a.studentAnswer ?? '-']];
            if (written) {
              if (a.correctAnswer) rows.push(['Expected answer', a.correctAnswer]);
              if (a.teacherFeedback) rows.push(['Teacher feedback', a.teacherFeedback]);
            } else {
              rows.push(['Correct answer', a.correctAnswer || '-']);
              rows.push(['MCQ', a.isCorrect ? 'True' : 'False']);
            }
            autoTable(doc, {
              startY: y,
              body: rows,
              styles: { fontSize: 9, cellPadding: 2 },
              columnStyles: { 0: { cellWidth: 38, fontStyle: 'bold' } },
            });
            y = doc.lastAutoTable.finalY + 8;
          });
          y += 4;
        });
      });

      doc.save(`results-${(lesson?.title || 'lesson').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('PDF export failed. Check the console for details.');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteResults = async () => {
    setDeleting(true);
    try {
      await resultService.deleteLessonResults(id);
      setShowDeleteModal(false);
      loadResults();
    } catch (error) {
      console.error('Failed to delete results:', error);
      alert('Failed to delete results');
    } finally {
      setDeleting(false);
    }
  };

  const totalParticipants = results?.statistics?.totalParticipants || 0;
  const completedCount = results?.statistics?.completedCount || 0;
  const completionRate = totalParticipants > 0 ? Math.round((completedCount / totalParticipants) * 100) : 0;

  return (
    <div className="max-w-[1600px] mx-auto space-y-7">
      {/* Top Header & Breadcrumb Bar */}
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
              {lesson?.title || 'Lesson'} <span className="text-slate-400 font-normal">&bull;</span> <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Results</span>
            </h1>
            {results?.classroom ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                <span>🏫</span>
                <span>{results.classroom.name}</span>
                <Link to={`/lessons/${id}/results`} className="ml-1 text-[11px] underline text-purple-600 hover:text-purple-800">
                  (All classes)
                </Link>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                <span>🌐</span>
                <span>All Cohorts &amp; General Access</span>
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time classroom performance breakdown, student answers, and AI grading records.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportPdf}
            disabled={exporting || !results || results.results.length === 0}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-4.5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {exporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export to PDF Report</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={!results || results.results.length === 0}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:pointer-events-none"
            title="Delete all student submissions for this lesson"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear Results</span>
          </button>
        </div>
      </div>

      {/* Modern Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Participants */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Total Participants</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">{totalParticipants}</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
              Students
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            <span>👥</span>
            <span>Joined via class PIN</span>
          </p>
        </div>

        {/* Completed Sessions */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Completed Sessions</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 tabular-nums tracking-tight">{completedCount}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              {completionRate}% finished
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            <span>✅</span>
            <span>Submitted all answers</span>
          </p>
        </div>

        {/* Live Status / Access Code */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-200 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Lesson Access PIN</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-black text-purple-600 tracking-wider">
              {lesson?.accessCode || '—'}
            </span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-full">
              6-Digit Code
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
            <span>🔑</span>
            <span>Share with students to join</span>
          </p>
        </div>
      </div>

      {/* Main Student Results Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              📊
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Student Submissions</h2>
              <p className="text-xs text-slate-400">All submissions recorded for this interactive module</p>
            </div>
          </div>

          {results?.results && results.results.length > 0 && (
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg self-start sm:self-auto">
              {results.results.length} total entries
            </span>
          )}
        </div>

        {!results || results.results.length === 0 ? (
          <div className="p-12 sm:p-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
              📊
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">No student submissions yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              When students enter the 6-character access code and complete this English lesson, their scores, answers, and written responses will show up here instantly.
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700">
              <span>🔑 Lesson PIN:</span>
              <span className="font-mono font-bold text-blue-600">{lesson?.accessCode || '—'}</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Started</th>
                  <th className="px-6 py-4">Completed</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {results.results.map((result) => (
                  <tr key={result.sessionId} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {(result.studentName || 'S').charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate group-hover:text-blue-600 transition-colors">
                        {result.studentName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {result.className ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                          {result.className}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">General</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                        result.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${result.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {result.status === 'COMPLETED' ? (
                        result.pendingCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                            ⏳ {result.pendingCount} pending review
                          </span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold text-slate-900 tabular-nums text-sm">
                              {result.score}/{result.totalPoints}
                            </span>
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                              result.percentage >= 80
                                ? 'text-emerald-700 bg-emerald-50'
                                : result.percentage >= 50
                                ? 'text-blue-700 bg-blue-50'
                                : 'text-rose-700 bg-rose-50'
                            }`}>
                              {result.percentage}%
                            </span>
                          </div>
                        )
                      ) : (
                        <span className="text-slate-400 font-medium">In Progress</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 tabular-nums">
                      {result.startedAt ? new Date(result.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 tabular-nums">
                      {result.completedAt ? new Date(result.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/lessons/${id}/results/${result.sessionId}${classId ? `?classId=${classId}` : ''}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 transition-all shadow-xs"
                      >
                        <span>Review</span>
                        <span className="text-xs">→</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete lesson results?"
          message={`Delete all ${results?.results.length || 0} result(s) of "${lesson?.title}"? Sessions and answers will be permanently removed from the database to free space. The lesson and its questions are kept. Export to PDF first if you need a copy!`}
          confirmLabel="Delete"
          loading={deleting}
          onConfirm={handleDeleteResults}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default LessonResults;