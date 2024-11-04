import React from 'react';
import { cn } from '../../utils/cn';
import { Link, LinkProps } from 'react-router-dom';

// Define button color variants
const buttonVariants = {
  primary: 'bg-gray-200 hover:bg-gray-300 dark:bg-dark-200 dark:hover:bg-dark-100 ',
  gradient: 'bg-gradient-to-r from-primary-redLite to-primary-orangeLite hover:from-primary-orangeLite hover:to-primary-orangeLite text-white',
  outline: 'border border-dark-100 text-dark-600 hover:bg-dark-100 hover:text-white dark:border-dark-200 dark:text-white dark:hover:bg-dark-100',
  ghost: 'bg-transparent text-dark-600 hover:bg-gray-200 dark:text-white dark:hover:bg-dark-200',
  link: 'bg-transparent text-text-light hover:text-black dark:text-text-dark dark:hover:text-white',
};

// Define button sizes
const buttonSizes = {
  small: 'h-9 px-3 py-2 text-sm',
  medium: 'h-10 px-4 py-2 text-base',
  large: 'h-11 px-8 py-2 text-base',
};

// Base styles for the button, including gap and SVG styling
const buttonBaseStyles = cn(
  'inline-flex items-center justify-center gap-2',
  'rounded',
  'transition-all',
  '[&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:h-auto',
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
   * If this is true, the button will be round.
   */
  rounded?: boolean;
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
  rounded = false,
  asLink = false,
  to,
  children,
  className,
  ...props
}) => {
  // Combine base styles with variant and size-specific styles
  const classes = cn(
    buttonBaseStyles,
    buttonVariants[variant],
    buttonSizes[size],
    rounded && 'rounded-full w-10 h-10',
    className
  );

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
