import React from 'react';
import { cn } from '../../utils/cn';
import { Link, LinkProps } from 'react-router-dom';

// Define button color variants
const buttonVariants = {
  primary: 'bg-blue-500 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-700 text-white',
  danger: 'bg-red-500 hover:bg-red-700 text-white',
};

// Define button sizes
const buttonSizes = {
  small: 'py-2 px-4 text-sm',
  medium: 'py-2 px-6 text-base',
  large: 'py-3 px-8 text-lg',
};

// Base styles for the button, including gap and SVG styling
const buttonBaseStyles = cn(
  'inline-flex items-center justify-center gap-2',
  'rounded-md',
  'font-medium',
  'transition-all',
  '[&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:h-auto'
);

interface ButtonProps extends React.ComponentProps<'button'> {
  /**
   * Defines the color variant for the button.
   * @default 'primary'
   */
  variant?: keyof typeof buttonVariants;
  /**
   * Defines the size of the button.
   * @default 'medium'
   */
  size?: keyof typeof buttonSizes;
  /**
   * If true, the button will render as a link (`<a>` element) using `react-router-dom`'s `<Link>` component.
   */
  asLink?: boolean;
  /**
   * The URL or path to navigate to if the button renders as a link.
   */
  to?: string;
}

/**
 * @component Button
 * @description A versatile button component that supports different sizes, color variants, and can render as either a button or a link.
 * The button can accept an icon as a child element, and automatically styles SVG icons.
 *
 * @example
 * <Button variant="primary" size="large">Click Me</Button>
 *
 * @example
 * <Button asLink to="/about" variant="secondary">Go to About</Button>
 *
 * @param {ButtonProps} props - The props to configure the button component.
 * @returns {JSX.Element} The rendered button or link component.
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  asLink = false,
  to,
  children,
  className,
  ...props
}) => {
  // Combine base styles with variant and size-specific styles
  const classes = cn(buttonBaseStyles, buttonVariants[variant], buttonSizes[size], className);

  // If `asLink` is true, render the button as a <Link> component
  if (asLink && to) {
    const { ...linkProps } = props;
    return (
      <Link className={classes} to={to} {...(linkProps as Omit<LinkProps, 'to'>)}>
        {children}
      </Link>
    );
  }

  // Otherwise, render as a regular button element
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
