import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/10 hover:shadow-teal-700/20 focus:ring-teal-500",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 focus:ring-slate-400",
    outline: "border-2 border-teal-600 text-teal-600 hover:bg-teal-50 focus:ring-teal-500",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/10 hover:shadow-rose-700/20 focus:ring-rose-500",
    ghost: "text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-400",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
