import React, { useState, useRef, useEffect, ReactNode, createContext } from 'react';
import { DropdownContent } from './DropdownContent';
import { DropdownTrigger } from './DropdownTrigger';

/**
 * @interface DropdownContextProps
 * @description Provides context values for controlling the open state of the dropdown.
 * @property {boolean} isOpen - Tracks if the dropdown is open.
 * @property {() => void} toggleDropdown - Toggles the open state of the dropdown.
 * @property {() => void} closeDropdown - Closes the dropdown.
 */
interface DropdownContextProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  closeDropdown: () => void;
}

export const DropdownContext = createContext<DropdownContextProps | undefined>(undefined);

/**
 * @component Dropdown
 * @description A modular dropdown menu component with Trigger and Content subcomponents.
 */
interface DropdownComponent extends React.FC<{ children: ReactNode }> {
  Trigger: typeof DropdownTrigger;
  Content: typeof DropdownContent;
}

const Dropdown: DropdownComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, toggleDropdown, closeDropdown }}>
      <div ref={dropdownRef} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;

export default Dropdown;
