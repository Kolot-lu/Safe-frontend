import { ReactNode, useContext, useEffect, useState } from 'react';
import { DropdownContext } from './Dropdown';

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
        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 
          ${context.isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}
      >
        {children}
      </div>
    )
  );
};
