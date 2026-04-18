import React from "react";
import { Settings, Search, FileText, Loader2, Zap } from "lucide-react";

function QuizSettings({
  isDark,
  topic,
  setTopic,
  syllabus,
  setSyllabus,
  difficulty,
  setDifficulty,
  numQuestions,
  setNumQuestions,
  handleGenerate,
  loading,
}) {
  return (
    <div
      className={`p-6 md:p-8 rounded-2xl border transition-all ${
        isDark
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-zinc-200 shadow-sm"
      }`}
    >
      <h2 className="text-lg font-bold mb-8 flex items-center gap-3 tracking-tight">
        <Settings size={18} className="text-indigo-600 dark:text-indigo-400" />
        Quiz Settings
      </h2>

      <div className="space-y-6 relative z-10">
        
        {/* Topic Input */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
            Exam Name / Topic
          </label>
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Science Assignment"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none font-medium transition-all ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-indigo-500/50"
                  : "bg-transparent border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              }`}
            />
          </div>
        </div>

        {/* Syllabus Input */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
            Syllabus / Context
          </label>
          <div className="relative group">
            <FileText
              className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <textarea
              rows="5"
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              placeholder="Paste key topics or context here..."
              className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none font-medium resize-none transition-all custom-scrollbar ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-indigo-500/50"
                  : "bg-transparent border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              }`}
            />
          </div>
        </div>

        {/* Difficulty & Questions Count */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none font-semibold cursor-pointer transition-all ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-indigo-500/50"
                  : "bg-transparent border-zinc-200 text-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              }`}
            >
              <option value="Easy">Easy</option>
              <option value="Medium"> Medium</option>
              <option value="Advanced"> Hard</option>
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Questions
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className={`w-full p-3 rounded-xl border outline-none font-semibold transition-all ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-white focus:border-indigo-500/50"
                  : "bg-transparent border-zinc-200 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              }`}
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-4 mt-4 rounded-xl flex justify-center items-center gap-2 font-bold text-white transition-all transform active:scale-[0.98] ${
            loading
              ? "bg-zinc-400 dark:bg-zinc-700 cursor-wait opacity-80"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Generating...
            </>
          ) : (
            <>
              <Zap size={18} className="fill-white/20" /> Generate Questions
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuizSettings;
