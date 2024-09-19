import { ToastPosition, useToastStore } from '../store/useToastStore';
import { ToastProps } from '../components/ui/Toast/Toast';

/**
 * Hook for displaying and managing toasts.
 * This provides easy-to-use methods for adding and removing toasts in the global state.
 */
export const useToast = () => {
  const { addToast, removeToast } = useToastStore();

  /**
   * Displays a toast with the provided configuration.
   * @param toast - The toast object containing message, type, duration, etc.
   * @param position - The position where the toast should appear (optional, defaults to 'top-right').
   */
  const showToast = (toast: ToastProps, position: ToastPosition = 'top-right') => {
    addToast(toast, position);
  };

  /**
   * Removes a toast by its ID.
   * @param id - The unique identifier of the toast to be removed.
   */
  const hideToast = (id: string) => {
    removeToast(id);
  };

  return { showToast, hideToast };
};
