import React, { useEffect } from "react";

export default function Toast({
  message,
  type = "success", // success, error, warning, info
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const backgroundColors = {
    success: "bg-emerald-600 text-white shadow-emerald-600/10",
    error: "bg-rose-600 text-white shadow-rose-600/10",
    warning: "bg-amber-500 text-white shadow-amber-500/10",
    info: "bg-teal-600 text-white shadow-teal-600/10",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠️",
    info: "ℹ",
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-200 ${backgroundColors[type]}`}>
      <span className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full text-xs font-extrabold">
        {icons[type]}
      </span>
      <p className="font-semibold text-sm">{message}</p>
      <button 
        onClick={onClose}
        className="ml-2 hover:bg-white/10 p-0.5 rounded transition-all text-white/70 hover:text-white focus:outline-none"
      >
        ✕
      </button>
    </div>
  );
}
