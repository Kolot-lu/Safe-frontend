import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to conditionally join class names and merge Tailwind classes.
 *
 * This function combines `clsx` for conditional class merging and `twMerge`
 * to resolve conflicts in Tailwind CSS classes.
 *
 * @param inputs - An array of class values that can be strings, objects, or arrays of strings.
 * @returns A string with the final class names after merging.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
