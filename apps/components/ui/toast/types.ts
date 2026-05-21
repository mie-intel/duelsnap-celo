export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'celebration';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // ms, default 4000
  action?: { label: string; onClick: () => void };
}
