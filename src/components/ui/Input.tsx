import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.ComponentProps<'input'> {
  /**
   * The label text for the input field.
   */
  label?: string;
  /**
   * Error message to display below the input field.
   */
  error?: string;
  /**
   * Additional description text to display below the input field.
   */
  description?: string;
  /**
   * Additional class names for the input wrapper.
   */
  wrapperClassName?: string;
}

/**
 * @component Input
 * @description A reusable input component with support for labels, error messages, and accessibility.
 *
 * @example
 * <Input
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 *   description="We'll never share your email with anyone else."
 *   error="Invalid email address"
 * />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, description, wrapperClassName, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'px-4 py-2 rounded-md border',
            'bg-gray-100 dark:bg-dark-500 text-gray-900 dark:text-gray-100',
            'border-border-light dark:border-border-dark',
            'focus:outline-none focus:ring-2 focus:ring-focus-light dark:focus:ring-focus-dark',
            error && '!border-red-500 !focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
    );
  }
);

// Set a display name for the component (useful for debugging)
Input.displayName = 'Input';

export default Input;
