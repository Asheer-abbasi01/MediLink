import React from "react";

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
  disabled = false,
  icon,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed
            ${icon ? "pl-10" : "pl-4"}
            ${error 
              ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500" 
              : "border-slate-200 focus:ring-teal-500/20 focus:border-teal-500"
            }`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
}
