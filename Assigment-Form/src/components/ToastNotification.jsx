import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

function ToastNotification({ toast }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl backdrop-blur-xl border transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
        toast.type === "error"
          ? "bg-red-500/90 border-red-400/50 text-white shadow-red-500/20"
          : "bg-zinc-900 border-zinc-800 text-white dark:bg-white dark:border-zinc-200 dark:text-zinc-900 shadow-black/20"
      }`}
    >
      {toast.type === "error" ? (
        <AlertCircle size={18} />
      ) : (
        <CheckCircle
          size={18}
          className="text-emerald-400 dark:text-emerald-600"
        />
      )}

      <span className="font-medium text-sm pr-2">{toast.message}</span>
    </div>
  );
}

export default ToastNotification;
