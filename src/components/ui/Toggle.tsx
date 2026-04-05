'use client';

import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export default function Toggle({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}: ToggleProps) {
  const trackSize = size === 'sm' ? 'w-8 h-[18px]' : 'w-11 h-6';
  const thumbSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  const thumbTranslate = size === 'sm'
    ? (enabled ? 'translate-x-[14px]' : 'translate-x-0.5')
    : (enabled ? 'translate-x-[22px]' : 'translate-x-0.5');

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`
          relative inline-flex flex-shrink-0 ${trackSize} rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${enabled ? 'bg-brand-600' : 'bg-slate-300'}
        `}
      >
        <span
          className={`
            inline-block ${thumbSize} rounded-full bg-white shadow-sm
            transform transition-transform duration-200 ease-in-out
            ${thumbTranslate} self-center
          `}
        />
      </button>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <span className="text-sm font-medium text-slate-900">{label}</span>
          )}
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
