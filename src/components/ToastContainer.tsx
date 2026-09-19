import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const variantStyles: Record<ToastVariant, { icon: React.ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-900'
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    className: 'border-sky-200 bg-sky-50 text-sky-900'
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    className: 'border-amber-200 bg-amber-50 text-amber-900'
  },
  error: {
    icon: <XCircle className="w-4 h-4" />,
    className: 'border-rose-200 bg-rose-50 text-rose-900'
  }
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => onDismiss(toast.id), 3500)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-5 bottom-5 z-[1200] flex w-[min(360px,calc(100vw-32px))] flex-col gap-2">
      {toasts.map((toast) => {
        const config = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            className={`rounded-2xl border p-3 shadow-floating backdrop-blur-sm ${config.className}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{config.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold leading-snug">{toast.title}</div>
                <div className="mt-1 text-[11px] leading-relaxed opacity-80">{toast.message}</div>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="ml-1 rounded-lg p-1 hover:bg-black/5 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
