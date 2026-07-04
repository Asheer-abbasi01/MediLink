import React from "react";

export default function Badge({
  children,
  variant = "info",
  className = "",
  size = "sm",
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full";
  
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    danger: "bg-rose-50 text-rose-700 border border-rose-100",
    info: "bg-blue-50 text-blue-700 border border-blue-100",
    neutral: "bg-slate-50 text-slate-700 border border-slate-200",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
