import { ReactNode, useContext, useEffect, useState } from 'react';
import { DropdownContext } from './Dropdown';
import { cn } from '../../../utils/cn';

/**
 * @component DropdownContent
 * @description The dropdown content that appears when triggered, with a fade-in/out animation.
 */
export const DropdownContent: React.FC<{ closeOnClisk?: boolean; children: ReactNode }> = ({
  closeOnClisk = true,
  children,
}) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownContent must be used within a Dropdown');

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (context.isOpen) return setIsAnimating(true);

    const timer = setTimeout(() => setIsAnimating(false), 200);
    return () => clearTimeout(timer);
  }, [context.isOpen]);

  return (
    (isAnimating || context.isOpen) && (
      <div
        onClick={closeOnClisk ? context.closeDropdown : undefined}
        role="menu"
        aria-labelledby="dropdown-trigger"
        className={cn(
          'absolute right-0 mt-2 w-fit rounded-md flex flex-col gap-2 p-3 bg-gray-100/30 dark:bg-dark-400/30 backdrop-blur-xl border border-border-light dark:border-border-dark z-[100]',
          context.isOpen ? 'animate-fadeIn' : 'animate-fadeOut'
        )}
      >
        {children}
      </div>
    )
  );
};
