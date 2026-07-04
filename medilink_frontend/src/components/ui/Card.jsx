import React from "react";

export default function Card({
  children,
  title,
  subtitle,
  actions,
  className = "",
  hoverEffect = false,
  bodyClass = "p-6",
  ...props
}) {
  const shadowStyles = "bg-white border border-slate-100 rounded-2xl shadow-sm";
  const hoverStyles = hoverEffect ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" : "";

  return (
    <div className={`${shadowStyles} ${hoverStyles} ${className}`} {...props}>
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4">
          <div>
            {title && <h3 className="font-bold text-slate-800 text-lg leading-tight">{title}</h3>}
            {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </div>
  );
}
