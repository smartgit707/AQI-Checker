import React from 'react';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  action,
  centered = false,
  className = ''
}) {
  return (
    <div className={`mb-10 sm:mb-12 ${centered ? 'text-center max-w-3xl mx-auto' : 'flex flex-col md:flex-row md:items-end md:justify-between'} ${className}`}>
      <div>
        {badge && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 ${
            centered ? 'mx-auto' : ''
          } bg-emerald-50 text-emerald-800 border border-emerald-200/60`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {badge}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && !centered && (
        <div className="mt-4 md:mt-0 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
