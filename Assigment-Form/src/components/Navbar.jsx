import React from "react";
import {
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  Zap,
  BarChart,
  Clock,
  CheckCircle2
} from "lucide-react";

function Navbar({
  isDark,
  toggleDark,
  setShowHelp,
  accessToken,
  login,
  activeTab,
  setActiveTab,
}) {
  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-2xl transition-all duration-300 border-b ${
        isDark
          ? "bg-[#030712]/80 border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-white/80 border-slate-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-auto min-h-[5rem] py-3 md:py-0 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 relative z-10">
        
        {/* TOP SECTION (Mobile: Logo + Quick Actions | Desktop: Logo) */}
        <div className="flex items-center justify-between w-full md:w-auto h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("creator")}>
            <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="text-white dark:text-zinc-900" size={16} fill="currentColor" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Quiz<span className="text-indigo-600 dark:text-indigo-400">Automator</span>
            </span>
          </div>

          {/* Mobile Quick Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              aria-label="Help"
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-400 transition-all active:scale-95"
            >
              <HelpCircle size={18} />
            </button>

            <button
              onClick={toggleDark}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-400 transition-all active:scale-95"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION: Segmented Control Tabs */}
        {/* Added inline scrollbar hiding for smooth horizontal scrolling on mobile */}
        <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border transition-colors mx-auto md:mx-0 ${
              isDark
                ? "bg-zinc-900/80 border-white/[0.05]"
                : "bg-slate-100/50 border-slate-200"
            }`}
          >
            {[
              { id: "creator", icon: Zap, label: "Create Quiz" },
              { id: "analytics", icon: BarChart, label: "Results" },
              { id: "history", icon: Clock, label: "History" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-5 py-2.5 md:py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400 ring-1 ring-black/5 dark:ring-white/10"
                    : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <tab.icon
                  size={16}
                  className={
                    activeTab === tab.id ? "opacity-100 scale-110 transition-transform" : "opacity-70"
                  }
                />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION: Desktop Actions & Mobile Connect */}
        <div className="flex items-center w-full md:w-auto justify-center md:justify-end gap-4">
          
          {/* Desktop Only: Help & Theme */}
          <div className="hidden md:flex items-center gap-3 mr-2">
            <button
              onClick={() => setShowHelp(true)}
              className="px-3 py-2 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors text-slate-600 dark:text-zinc-400 flex items-center gap-2 text-sm font-bold"
            >
              <HelpCircle size={18} className="text-slate-400 dark:text-zinc-500" /> Help
            </button>

            <button
              onClick={toggleDark}
              aria-label="Toggle Dark Mode"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 transition-all text-slate-600 dark:text-zinc-400 active:scale-95"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Universal: Connect / Connected Status */}
          {!accessToken ? (
            <button
              onClick={() => login()}
              className="w-full md:w-auto px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all flex justify-center items-center"
            >
              Connect Workspace
            </button>
          ) : (
            <div className="w-full md:w-auto px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold rounded-lg text-xs flex justify-center items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              Connected
              <CheckCircle2 size={14} className="ml-1 opacity-70" />
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;
