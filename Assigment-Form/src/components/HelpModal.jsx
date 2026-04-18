import React, { useEffect } from "react";
import { HelpCircle, X, LogIn, FileText, Settings, Link as LinkIcon, Share2, BarChart } from "lucide-react";


const HELP_STEPS = [
  {
    text: "Connect your Google Workspace from the top right button.",
    icon: LogIn,
  },
  {
    text: "Enter your Subject/Topic and paste the Syllabus details.",
    icon: FileText,
  },
  {
    text: "Select Difficulty & Number of Questions, then click 'Generate Questions'.",
    icon: Settings,
  },
  {
    text: "Review the questions on the right side and click 'Deploy to Google Forms'.",
    icon: LinkIcon,
  },
  {
    text: "Copy the generated link and share it with your students!",
    icon: Share2,
  },
  {
    text: "Check the 'Results' tab to see automatic grading and responses.",
    icon: BarChart,
  },
];

function HelpModal({ showHelp, setShowHelp }) {
  // 'Escape' key दबाने पर मोडल को बंद करने के लिए
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowHelp(false);
      }
    };

    if (showHelp) {
      document.addEventListener("keydown", handleKeyDown);
      // बैकग्राउंड स्क्रॉलिंग रोकने के लिए
      document.body.style.overflow = "hidden"; 
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showHelp, setShowHelp]);

  if (!showHelp) return null;

  return (
    // Overlay: बाहर क्लिक करने पर बंद करने के लिए onClick ऐड किया है
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-300 '
      onClick={() => setShowHelp(false)}>
      {/* Modal Container: stopPropagation ताकि अंदर क्लिक करने पर बंद न हो */}
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='help-modal-title'
        className='   bg-white dark:bg-zinc-900 rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl relative border border-slate-200 dark:border-white/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300'
        onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={() => setShowHelp(false)}
          aria-label='Close help modal'
          className='absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all text-slate-500 dark:text-zinc-400 hover:rotate-90'>
          <X size={20} />
        </button>

        {/* Header */}
        <div className='mb-6'>
          <h2
            id='help-modal-title'
            className='text-2xl font-black mb-2 flex items-center gap-3 text-slate-900 dark:text-white tracking-tight'>
            <div className='p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20'>
              <HelpCircle className='text-indigo-500' size={24} />
            </div>
            How to use Prince.io
          </h2>
          <p className='text-slate-500 dark:text-zinc-400 text-sm font-medium'>
            Follow these simple steps to generate and share your quiz
            automatically.
          </p>
        </div>

        {/* Steps List */}
        <div className='space-y-3 max-h-[60vh] overflow-y-auto pr-2 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {HELP_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className='flex gap-4 items-center bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/80 p-3.5 rounded-2xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5'>
                {/* Number & Icon Indicator */}
                <div className='flex flex-col items-center gap-1 shrink-0'>
                  <span className='flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-sm ring-1 ring-indigo-500/20'>
                    {idx + 1}
                  </span>
                </div>

                {/* Step Text */}
                <p className='text-sm font-medium text-slate-700 dark:text-zinc-300 leading-relaxed flex-1'>
                  {step.text}
                </p>

                {/* Optional Subtle Icon on the right */}
                <Icon
                  size={18}
                  className='text-slate-400/50 dark:text-zinc-500/50 shrink-0 hidden sm:block'
                />
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowHelp(false)}
          className='w-full mt-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold hover:-translate-y-0.5 shadow-xl shadow-zinc-900/20 dark:shadow-white/10 transition-all flex items-center justify-center gap-2'>
          Got it, let's go!
        </button>
      </div>
    </div>
  );
}

export default HelpModal;
