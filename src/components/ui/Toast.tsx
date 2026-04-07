'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      const next = [...prev, { id, type, title, message }];
      if (next.length > 3) return next.slice(1); // Keep max 3
      return next;
    });

    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const success = (title: string, message?: string) => toast('success', title, message);
  const error = (title: string, message?: string) => toast('error', title, message);
  const info = (title: string, message?: string) => toast('info', title, message);
  const warning = (title: string, message?: string) => toast('warning', title, message);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className="text-success-600" size={20} />,
    error: <AlertCircle className="text-danger-600" size={20} />,
    info: <Info className="text-brand-600" size={20} />,
    warning: <AlertTriangle className="text-warning-600" size={20} />,
  };

  const bgStyles = {
    success: 'bg-success-50 border-success-100',
    error: 'bg-danger-50 border-danger-100',
    info: 'bg-brand-50 border-brand-100',
    warning: 'bg-warning-50 border-warning-100',
  };

  return (
    <div 
      className={`
        pointer-events-auto flex items-start gap-4 p-4 rounded-xl border shadow-lg 
        animate-slide-in-right transform transition-all duration-300
        ${bgStyles[toast.type]}
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 leading-tight">{toast.title}</h4>
        {toast.message && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{toast.message}</p>}
      </div>
      <button 
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}
