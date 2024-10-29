import { ReactNode, useContext, cloneElement, isValidElement } from 'react';
import { DropdownContext } from './Dropdown';

/**
 * @component DropdownTrigger
 * @description The trigger component for opening the dropdown menu.
 */
export const DropdownTrigger: React.FC<{ children: ReactNode }> = ({ children }) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownTrigger must be used within a Dropdown');

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      context.toggleDropdown();
    }
  };

  // Check if children is a valid React element, and if it's a button
  if (isValidElement(children)) {
    const child = children as React.ReactElement;
    const isButton = child.type === 'button';

    return isButton
      ? cloneElement(child, { onClick: context.toggleDropdown })
      : cloneElement(child, {
          onClick: context.toggleDropdown,
          onKeyDown: handleKeyDown,
          tabIndex: 0,
          role: 'button',
          'aria-haspopup': 'menu',
          'aria-expanded': context.isOpen,
        });
  }

  return null;
};
