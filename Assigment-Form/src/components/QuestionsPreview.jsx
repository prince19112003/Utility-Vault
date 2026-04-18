import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";

function QuestionsPreview({
  isDark,
  loading,
  questions,
  creatingForm,
  handleCreateForm,
}) {
  // 1. PREMIUM LOADING STATE (Skeleton Loader)
  if (loading) {
    return (
      <div
        className={`h-full flex flex-col rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-zinc-200 shadow-sm"
        }`}
      >
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
          <div className="h-6 w-40 bg-slate-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
          <div className="h-9 w-32 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        </div>
        <div className="p-8 flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-zinc-400" size={32} />
          <p className="text-zinc-500 font-medium text-sm">Generating MCQs...</p>
        </div>
      </div>
    );
  }

  // 2. BEAUTIFUL EMPTY STATE
  if (!loading && questions.length === 0) {
    return (
      <div
        className={`h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
          isDark
            ? "border-zinc-800 text-zinc-600 bg-zinc-900/50"
            : "border-zinc-200 text-zinc-400 bg-zinc-50/50"
        }`}
      >
        <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-6 ring-1 ring-zinc-200 dark:ring-zinc-700">
          <LayoutDashboard size={40} className="opacity-20" />
        </div>

        <p className="font-bold text-xl text-slate-700 dark:text-zinc-300 tracking-tight">
          Ready to Generate
        </p>

        <p className="text-sm font-medium mt-2 max-w-xs text-center text-slate-500 dark:text-zinc-500">
          Fill the form on the left and click Generate to see questions here.
        </p>
      </div>
    );
  }

  // 3. POPULATED QUESTIONS PREVIEW
  return (
    <div
      className={`h-full flex flex-col rounded-2xl border overflow-hidden transition-all ${
        isDark
          ? 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/20'
          : 'bg-white border-zinc-200 shadow-sm'
      }`}>
      {/* Header */}
      <div className='p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-zinc-950/20'>
        <h3 className='font-bold text-[15px] flex items-center gap-3 text-zinc-800 dark:text-zinc-100'>
          Questions
          <span className='text-[10px] font-bold px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full uppercase tracking-tighter'>
            {questions.length} Total
          </span>
        </h3>
      </div>

      {/* Questions list */}
      <div className='p-6 flex-1 overflow-y-auto max-h-[600px] space-y-6 custom-scrollbar'>
        {questions.map((q, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500/30 ${
              isDark
                ? 'bg-zinc-900/60 border-white/5 shadow-inner'
                : 'bg-white border-slate-100 shadow-sm'
            }`}>
            <div className='flex gap-3 mb-5'>
              <span className='flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black text-sm flex-shrink-0'>
                {idx + 1}
              </span>
              <p className='font-semibold text-[15px] leading-relaxed text-black dark:text-zinc-200 mt-0.5'>
                {q.question}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pl-10'>
              {q.options?.map((opt, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    i === q.answerIndex
                      ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}>
                  <span
                    className={`mr-2.5 font-bold ${
                      i === q.answerIndex
                        ? 'text-emerald-600 dark:text-emerald-500'
                        : 'text-white dark:text-zinc-600'
                    }`}>
                    {String.fromCharCode(65 + i)}.
                  </span>{' '}
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Deploy button */}
      <div className='p-6 border-t border-black dark:border-white/5 bg-slate-50/50 dark:bg-zinc-950/50'>
        <button
          onClick={handleCreateForm}
          disabled={creatingForm}
          className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all transform ${
            creatingForm
              ? 'bg-zinc-200 dark:bg-zinc-800 cursor-wait text-zinc-400'
              : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-white shadow-sm'
          }`}>
          {creatingForm ? (
            <Loader2 className='animate-spin' size={20} />
          ) : (
            <>
              <LinkIcon size={18} /> Deploy to Google Forms
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuestionsPreview;
