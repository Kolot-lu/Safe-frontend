import { useContext } from 'react';
import { FinderContext } from './Finder';
import { cn } from '../../../utils/cn';

/**
 * @interface FinderEmptyProps
 * @description Props for the FinderEmpty component.
 * @property {string} message - Message to display when no options are found.
 * @property {string} [className] - Additional class names for customizing the appearance.
 */
interface FinderEmptyProps {
  message: string;
  className?: string;
}

/**
 * @component FinderEmpty
 * @description Component that displays a message when no options match the search query in the Finder.
 * @param {string} message - Message to display when no options are found.
 * @param {string} [className] - Additional class names for customization.
 *
 * @example
 * <FinderEmpty message="No tokens found." className="text-gray-500" />
 */
export const FinderEmpty = ({ message, className }: FinderEmptyProps) => {
  const context = useContext(FinderContext);
  if (!context) {
    throw new Error('FinderEmpty must be used within a Finder.');
  }

  // Only render if there are no filtered options
  if (context.filteredOptions.length > 0) {
    return null;
  }

  return (
    <div className={cn('p-2 text-center', className)} role="alert" aria-live="polite">
      {message}
    </div>
  );
};
