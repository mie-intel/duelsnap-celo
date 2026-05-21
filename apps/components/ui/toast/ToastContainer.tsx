'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Toast, ToastType } from './types';
import { useToast } from './ToastContext';

const stripeColor: Record<ToastType, string> = {
  success: 'bg-[var(--color-success)]',
  error: 'bg-[var(--color-error)]',
  warning: 'bg-[var(--color-warning)]',
  info: 'bg-[var(--color-info)]',
  celebration: 'bg-[var(--color-secondary)] animate-celebration-shimmer',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  return (
    <motion.div
      key={toast.id}
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="relative flex min-w-[320px] max-w-[400px] overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] shadow-xl backdrop-blur-sm"
      role="alert"
      aria-live="polite"
    >
      {/* Left stripe */}
      <div className={`w-1 shrink-0 ${stripeColor[toast.type]}`} />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5 px-4 py-3">
        <p className="font-display text-sm font-semibold text-[var(--color-text-primary)] leading-snug">
          {toast.title}
        </p>
        {toast.description && (
          <p className="font-sans text-xs text-[var(--color-text-secondary)] leading-snug">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="mt-1 self-start text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="flex shrink-0 items-start px-3 pt-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 p-0"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
