import { useToast } from './useToast';

/**
 * Custom hook for handling errors and showing toast notifications.
 */
export const useErrorHandler = () => {
  const { showToast } = useToast();

  /**
   * Handles the error and shows a toast notification if needed.
   * @param error - The error object or message to handle.
   * @param isToast - A flag indicating whether the error should be shown as an toast.
   * @param toastMessage - An optional message to display in the toast notification.
   */
  const handleError = (error: unknown, isToast: boolean = true, toastMessage?: string) => {
    console.error(error instanceof Error ? error.message : 'Unknown error:', error);

    if (isToast) {
      toastMessage = toastMessage || (error instanceof Error ? error.message : String(error));
      showToast({
        message: toastMessage,
        type: 'error',
      });
    }
  };

  return { handleError };
};
