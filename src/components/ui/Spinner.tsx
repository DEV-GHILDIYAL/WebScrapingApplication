import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export default function Spinner({
  size = 'md',
  className = '',
  label = 'Loading...',
}: SpinnerProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} role="status">
      <svg
        className={`animate-spin text-brand-600 ${sizeStyles[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/* Full-page loading state */
export function PageSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-fade-in">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}

/* Inline loading placeholder for data sections */
export function InlineSpinner({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
      <Spinner size="sm" />
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}
