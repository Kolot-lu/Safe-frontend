import React from 'react';
import { cn } from '../../utils/cn';

interface HrProps {
  /**
   * If true, renders a vertical divider instead of a horizontal one.
   * @default false
   */
  isVertical?: boolean;
  /**
   * Additional custom classes to style the divider.
   */
  className?: string;
}

/**
 * @component Hr
 * @description A versatile divider component that supports both horizontal and vertical orientations.
 * Ideal for separating content sections in a visually appealing and accessible manner.
 *
 * @example
 * <Hr />
 *
 * @example
 * <Hr isVertical />
 *
 * @param {HrProps} props - The props to configure the divider.
 * @returns {JSX.Element} A styled `<hr>` element or a `<div>` for vertical orientation.
 */
const Hr: React.FC<HrProps> = ({ isVertical = false, className }) => {
  const baseStyles = 'bg-border-light dark:bg-border-dark';
  const horizontalStyles = 'inline-block h-[1px] w-full self-stretch border-none';
  const verticalStyles = 'inline-block w-[1px] h-full self-stretch border-none';

  return (
    <div
      className={cn(baseStyles, isVertical ? verticalStyles : horizontalStyles, className)}
      role="separator"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
    />
  );
};

export default Hr;
