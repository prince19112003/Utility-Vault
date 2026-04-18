import React from "react";
import { Sparkles } from "lucide-react";

function SplashScreen({ showSplash, fadeSplash }) {
  if (!showSplash) return null;

  return (
    <div
      aria-hidden="true" // Screen readers के लिए हाइड किया है ताकि डिस्टर्बेंस न हो
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712] transition-all duration-1000 ease-in-out overflow-hidden ${
        fadeSplash
          ? "opacity-0 scale-110 blur-md pointer-events-none" // Fade out के टाइम हल्का सा blur और ज़ूम इफ़ेक्ट
          : "opacity-100 scale-100 blur-0"
      }`}
    >
      {/* Cinematic Ambient Glows (Layered for depth) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15rem] h-[15rem] bg-purple-500/20 rounded-full blur-[60px] pointer-events-none animate-pulse"></div>

      <div className="flex flex-col items-center relative z-10">
        
        {/* Premium Icon Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
          <div className="relative p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.5)] border border-white/20 backdrop-blur-sm">
            <Sparkles className="text-white drop-shadow-lg" size={44} strokeWidth={1.5} />
          </div>
        </div>

        {/* Brand Typography with Gradient */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-indigo-50 to-zinc-400 mb-4 drop-shadow-2xl text-center select-none">
          Prince<span className="text-indigo-500">.io</span>
        </h1>

        {/* Subtitle & Loading Indicator */}
        <div className="flex flex-col items-center gap-6 mt-2">
          <p className="text-indigo-200/70 text-sm md:text-base font-bold tracking-[0.4em] uppercase select-none">
            Quiz Generator
          </p>

          {/* Sleek Minimal Loading Dots */}
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 animate-ping" style={{ animationDuration: '1.5s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500/80 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.4s' }}></div>
          </div>
        </div>

      </div>

      {/* Tiny Watermark/Detail at the bottom (Optional but looks highly professional) */}
      <div className="absolute bottom-8 text-zinc-600 text-[10px] font-bold tracking-widest uppercase">
        Initializing Engine...
      </div>
    </div>
  );
}

export default SplashScreen;
