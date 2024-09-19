import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ToastProps } from '../components/ui/Toast/Toast';

/**
 * Enum for Toast positions to ensure consistency and prevent typos.
 */
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

/**
 * Extended interface for Toast including a unique id and optional position.
 */
export interface ToastWithId extends ToastProps {
  id: string;
  position?: ToastPosition;
}

/**
 * Interface for the Toast Store. Defines the state and actions for managing toasts.
 */
interface ToastStore {
  toasts: ToastWithId[]; // Array of toasts with unique ids and positions
  addToast: (toast: ToastProps, position?: ToastPosition) => void; // Function to add a toast
  removeToast: (id: string) => void; // Function to remove a toast by id
  setToastPosition: (position: ToastPosition) => void; // Function to update the position of all toasts
}

/**
 * Function to generate a new toast with a unique id and optional position.
 * @param toast - The toast object with message and type.
 * @param position - The position for the toast (optional, defaults to 'top-right').
 * @returns ToastWithId - A new toast object with a unique id and position.
 */
const createToast = (toast: ToastProps, position: ToastPosition = 'top-right'): ToastWithId => {
  return {
    ...toast,
    id: uuidv4(),
    position,
  };
};

/**
 * Zustand store for managing the global state of toasts.
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  /**
   * Adds a new toast to the store.
   * @param toast - The toast content (message, type, etc.).
   * @param position - Optional position to specify where the toast will appear.
   */
  addToast: (toast, position) =>
    set((state) => ({
      toasts: [...state.toasts, createToast(toast, position)],
    })),

  /**
   * Removes a toast from the store by its unique id.
   * @param id - The unique identifier of the toast to remove.
   */
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  /**
   * Updates the position of all toasts currently in the store.
   * @param position - The new position to apply to all existing toasts.
   */
  setToastPosition: (position) =>
    set((state) => ({
      toasts: state.toasts.map((toast) => ({
        ...toast,
        position,
      })),
    })),
}));
