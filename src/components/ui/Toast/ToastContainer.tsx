import { useMemo } from 'react';
import { ToastWithId, useToastStore } from '../../../store/useToastStore';
import Toast from './Toast';

/**
 * Classes for positioning the toasts on the screen.
 */
const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

/**
 * Groups the visible toasts by their position on the screen.
 * This ensures that toasts are organized by position and displayed correctly.
 * @param toasts - The array of visible toasts.
 * @returns A dictionary where keys are positions and values are arrays of toasts.
 */
const groupToastsByPosition = (toasts: ToastWithId[]) => {
  return toasts.reduce((acc, toast) => {
    const { position = 'top-right' } = toast;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<string, ToastWithId[]>);
};

/**
 * ToastContainer component is responsible for rendering all toasts and positioning them on the screen.
 * @param maxToasts - The maximum number of toasts to display at one time (defaults to 3).
 */
const ToastContainer = ({ maxToasts = 3 }: { maxToasts?: number }) => {
  const { toasts } = useToastStore();

  // Limit the number of visible toasts and group them by position
  const visibleToasts = useMemo(() => toasts.slice(0, maxToasts), [toasts, maxToasts]);
  const groupedToasts = useMemo(() => groupToastsByPosition(visibleToasts), [visibleToasts]);

  return (
    <>
      {Object.keys(groupedToasts).map((position) => (
        <div
          key={position}
          className={`fixed z-50 space-y-2 ${positionClasses[position as keyof typeof positionClasses]}`}
          role="region"
          aria-live="polite"
          aria-relevant="additions text"
          aria-atomic="false"
        >
          {groupedToasts[position].map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
      ))}
    </>
  );
};

export default ToastContainer;
