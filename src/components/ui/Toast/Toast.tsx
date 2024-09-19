import { X } from 'lucide-react';
import { useToastStore, ToastPosition } from '../../../store/useToastStore';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';

/**
 * Types for the Toast component properties.
 */
export type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  closable?: boolean;
  position?: ToastPosition;
};

interface ToastWithId extends ToastProps {
  id: string;
}

/**
 * Toast component for rendering individual toast notifications.
 * Supports animations and positioning based on the provided position.
 */
const Toast = ({ id, message, type, duration = 3000, closable = true, position = 'top-right' }: ToastWithId) => {
  const { removeToast } = useToastStore();
  const [isVisible, setIsVisible] = useState(false);

  // Determine the initial transform based on the toast's position (enter animation)
  const getInitialTransform = useCallback(() => {
    switch (true) {
      case position.includes('left'):
        return '-translate-x-full'; // Slide in from the left
      case position.includes('right'):
        return 'translate-x-full'; // Slide in from the right
      case position.includes('bottom'):
        return 'translate-y-full'; // Slide up from the bottom
      default:
        return '-translate-y-full'; // Slide down from the top
    }
  }, [position]);

  // Final state where the toast is fully visible
  const getFinalTransform = useCallback(() => {
    return 'translate-x-0 translate-y-0'; // No transform (toast in final position)
  }, []);

  // Handle animation and toast lifecycle
  useEffect(() => {
    // Show toast with a slight delay for appearance animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Hide and remove toast after the specified duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false); // Trigger exit animation
      setTimeout(() => removeToast(id), 300); // Remove after animation completes
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, [id, duration, removeToast]);

  // Close toast on user action
  const handleClose = () => {
    setIsVisible(false); // Trigger exit animation
    setTimeout(() => removeToast(id), 300); // Remove toast after animation
  };

  // Define styles based on the type of the toast
  const typeClasses = {
    success: 'border-l-1.5 border-l-green-500',
    error: 'border-l-1.5 border-l-red-500',
    info: 'border-l-1.5 border-l-blue-500',
    warning: 'border-l-1.5 border-l-yellow-500',
  };

  return (
    <div
      className={cn(
        'toast-item relative px-5 py-6 rounded-lg backdrop-blur-xl bg-white/30 shadow-lg border transition-all duration-300 ease-in-out transform',
        isVisible ? getFinalTransform() + ' opacity-100' : getInitialTransform() + ' opacity-0',
        type && typeClasses[type]
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-message">{message}</div>
      {closable && (
        <button
          onClick={handleClose}
          aria-label="Close notification"
          className="absolute top-1.5 right-1.5 bg-transparent border hover:rotate-90 duration-300 p-0.5 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-400 rounded-full"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default Toast;
