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
  /**
   * Icon to display inside the input field.
   */
  icon?: React.ReactNode;
  /**
   * Determines whether the icon is placed on the left or right.
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
}

/**
 * @component Input
 * @description A styled input field component.
 * @param label - The label text for the input field.
 * @param error - Error message to display below the input field.
 * @param description - Additional description text to display below the input field.
 * @param wrapperClassName - Additional class names for the input wrapper.
 * @param icon - Icon to display inside the input field.
 * @param iconPosition - Determines whether the icon is placed on the left or right.
 * @param props - Additional input field props.
 * 
 * @example
 * <Input label="Email" placeholder="Enter your email" />
 * <Input error="Email is required" />
 * <Input icon={<Search />} />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, description, wrapperClassName, className, id, icon, iconPosition = 'left', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const descriptionId = description ? `${inputId}-description` : undefined;

    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && iconPosition === 'left' && <InputIcon position="left" icon={icon} />}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'px-4 py-2 rounded-md border w-full',
              'bg-gray-100 dark:bg-dark-500 text-gray-900 dark:text-gray-100',
              'border-border-light dark:border-border-dark',
              'focus:outline-none focus:ring-2 focus:ring-focus-light dark:focus:ring-focus-dark',
              error && '!border-red-500 !focus:ring-red-500',
              icon && iconPosition === 'left' && 'pl-9',
              icon && iconPosition === 'right' && 'pr-9',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={cn(errorId, descriptionId)}
            {...props}
          />
          {icon && iconPosition === 'right' && <InputIcon position="right" icon={icon} />}
        </div>
        {error && (<p id={errorId} className="text-red-500 text-sm" role="alert">{error}</p>)}
        {description && (<p id={descriptionId} className="text-gray-500 text-sm">{description}</p>)}
      </div>
    );
  }
);

interface InputIconProps {
  position: 'left' | 'right';
  icon: React.ReactNode;
}

/**
 * @component InputIcon
 * @description Сomponent to render an icon inside an input field.
 * @param position - The position of the icon inside the input field, either 'left' or 'right'.
 * @param icon - The icon to render inside the input field.
 * 
 * @example
 * <InputIcon position="left" icon={<Search />} />
 */
const InputIcon: React.FC<InputIconProps> = ({ position, icon }) => {
  return (
    <span
      className={cn(
        'absolute inset-y-0 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 w-5',
        position === 'left' ? 'left-2' : 'right-2'
      )}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
};

// Set a display name for the component (useful for debugging)
Input.displayName = 'Input';

export default Input;
