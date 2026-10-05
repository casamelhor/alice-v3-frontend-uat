import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { create } from 'zustand';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * @typedef {'success' | 'error' | 'warning' | 'info'} ToastType
 */

/**
 * @typedef {Object} Toast
 * @property {string} id
 * @property {ToastType} type
 * @property {string} title
 * @property {string} [message]
 * @property {number} [duration]
 */

/**
 * @typedef {Object} ToastStore
 * @property {Toast[]} toasts
 * @property {(toast: Omit<Toast, 'id'>) => void} addToast
 * @property {(id: string) => void} removeToast
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ToastStore>>} */
export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast-${Date.now()}-${Math.random().toString(36).slice(2)}` },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

/**
 * Helper function to show toasts
 */
export const toast = {
  /**
   * @param {string} title
   * @param {string} [message]
   */
  success: (title, message) =>
    useToastStore.getState().addToast({ type: 'success', title, message }),
  /**
   * @param {string} title
   * @param {string} [message]
   */
  error: (title, message) =>
    useToastStore.getState().addToast({ type: 'error', title, message }),
  /**
   * @param {string} title
   * @param {string} [message]
   */
  warning: (title, message) =>
    useToastStore.getState().addToast({ type: 'warning', title, message }),
  /**
   * @param {string} title
   * @param {string} [message]
   */
  info: (title, message) =>
    useToastStore.getState().addToast({ type: 'info', title, message }),
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-500',
    title: 'text-emerald-800',
    message: 'text-emerald-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
    message: 'text-red-600',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-500',
    title: 'text-amber-800',
    message: 'text-amber-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-600',
  },
};

/**
 * Individual toast item component
 * @param {Object} props
 * @param {Toast} props.toast - Toast data
 * @returns {JSX.Element}
 */
function ToastItem({ toast }) {
  const { removeToast } = useToastStore();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 5000;
    const exitTimer = setTimeout(() => setIsExiting(true), duration - 300);
    const removeTimer = setTimeout(() => removeToast(toast.id), duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, toast.duration, removeToast]);

  const Icon = icons[toast.type];
  const style = styles[toast.type];

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'transition-all duration-300',
        style.bg,
        style.border,
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      )}
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', style.icon)} />
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', style.title)}>{toast.title}</p>
        {toast.message && (
          <p className={clsx('text-sm mt-1', style.message)}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
};

/**
 * Toast container component
 * @returns {JSX.Element | null}
 */
export function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
