import { ToastProps } from '../components/ui/Toast/Toast';
import { useToast } from './useToast';

/**
 * Custom hook for handling flash messages and optionally logging them to the console.
 * @param message - The message to display in the toast.
 * @param consoleMessage - The message to log to the console (optional).
 * @param shouldLog - A flag indicating whether to log the message to the console (default: true).
 * @param type - The type of the toast (success, error, info, warning).
 */
export const useFlashMessage = () => {
  const { showToast } = useToast();

  const showFlashMessage = (
    message: string,
    type: ToastProps['type'] = 'info',
    consoleMessage?: string,
    shouldLog: boolean = true
  ) => {
    showToast({ message, type });

    if (shouldLog) {
      const logMessage = consoleMessage || message;
      if (type === 'error') return console.error(logMessage);
      if (type === 'warning') return console.warn(logMessage);
      return console.log(logMessage);
    }
  };

  return { showFlashMessage };
};
