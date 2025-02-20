import React from 'react';
import { cn } from '../../utils/cn';

interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  /**
   * The text label associated with the checkbox.
   */
  label?: string;
  /**
   * An error message displayed below the checkbox.
   */
  error?: string;
  /**
   * Additional description text displayed below the checkbox.
   */
  description?: string;
  /**
   * Extra class names for the component wrapper.
   */
  wrapperClassName?: string;
}

/**
 * @component Checkbox
 * @description A styled checkbox component with optional label, error message, and description text.
 *
 * @param label - The text label associated with the checkbox.
 * @param error - An error message displayed below the checkbox.
 * @param description - Additional description text displayed below the checkbox.
 * @param wrapperClassName - Extra class names for the component wrapper.
 * @param props - Additional props for the underlying `input` (except for "type", which is fixed to "checkbox").
 *
 * @example
 * <Checkbox label="Accept terms" />
 * <Checkbox error="You must accept the terms" />
 * <Checkbox description="Additional details about the option" />
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, wrapperClassName, className, id, ...props }, ref) => {
    // Generate a unique id if none is provided
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const descriptionId = description ? `${checkboxId}-description` : undefined;

    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        <div className="relative flex items-center gap-1">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn("", className)}
            aria-invalid={!!error}
            aria-describedby={cn(errorId, descriptionId)}
            {...props}
          />

          {label && (
            <label htmlFor={checkboxId} className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
        </div>

        {description && (
          <p id={descriptionId} className="text-gray-500 text-sm">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-red-500 text-sm" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
