import { useState } from 'react';

const CodeQr = () => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="max-w-[1100px] mx-auto space-y-7">
      {/* Header */}
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600 mb-2">
          Student access
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Student Platform{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QR Code
          </span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
          Project this page in the classroom. Students scan the code to open the student site instantly.
        </p>
      </div>

      {/* Main card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* QR display */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
          <button
            onClick={() => setShowFull(true)}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs cursor-zoom-in hover:shadow-md hover:border-blue-200 transition-all group"
            title="Click to enlarge"
          >
            <img
              src="/codeqr.jpg"
              alt="Student platform QR code"
              className="w-72 h-72 sm:w-80 sm:h-80 object-contain rounded-xl group-hover:scale-[1.01] transition-transform"
            />
          </button>
          <p className="text-[11px] text-slate-400 mt-4 font-medium">
            Click the QR code to enlarge
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-[#091733] rounded-2xl p-7 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-base font-bold tracking-tight mb-1 relative">
            How it works in class
          </h2>
          <p className="text-xs text-slate-400 mb-6 relative">
            Three steps, less than a minute.
          </p>
          <div className="space-y-4 relative">
            {[
              {
                n: '01',
                title: 'Display the QR code',
                text: 'Show this page on the projector in the classroom.',
              },
              {
                n: '02',
                title: 'Students scan with their phone',
                text: 'They open the camera app, scan the code and land directly on the student platform.',
              },
              {
                n: '03',
                title: 'They enter the class code',
                text: 'Each lesson in My Classes has its own code. Results appear in real time.',
              },
            ].map((s) => (
              <div key={s.n} className="flex gap-4 bg-white/[0.05] border border-white/[0.08] rounded-xl p-4">
                <span className="text-xs font-black text-blue-400 tabular-nums shrink-0 pt-0.5">
                  {s.n}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-white leading-snug">{s.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showFull && (
        <div
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowFull(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full px-10 py-10 text-center relative border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFull(false)}
              className="absolute top-4 right-5 text-slate-300 hover:text-slate-600 text-2xl leading-none transition-colors"
              aria-label="Close"
            >
              ×
            </button>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.25em] mb-2">
              Student access
            </p>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight mb-6">
              Scan to open the student platform
            </h2>
            <div className="border-t border-b border-slate-100 py-6">
              <img
                src="/codeqr.jpg"
                alt="Student platform QR code large"
                className="w-full max-w-md mx-auto object-contain rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowFull(false)}
              className="mt-6 px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeQr;
