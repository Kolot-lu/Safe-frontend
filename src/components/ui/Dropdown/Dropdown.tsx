import React, { useState, useRef, useEffect, ReactNode, createContext, forwardRef, useImperativeHandle } from 'react';
import { DropdownContent } from './DropdownContent';
import { DropdownTrigger } from './DropdownTrigger';
import { cn } from '../../../utils/cn';

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
 * @interface DropdownHandle
 * @description Exposes methods to programmatically control the dropdown.
 */
export interface DropdownHandle {
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;
}

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

interface DropdownComponent
  extends React.ForwardRefExoticComponent<DropdownProps & React.RefAttributes<DropdownHandle>> {
  Trigger: typeof DropdownTrigger;
  Content: typeof DropdownContent;
}

/**
 * @component Dropdown
 * @description A flexible dropdown component that supports programmatic control via `ref` and a structured subcomponent API.
 *
 * ### Example Usage:
 * ```tsx
 * const dropdownRef = useRef<DropdownHandle>(null);
 *
 * return (
 *  <Dropdown ref={dropdownRef}>
 *   <Dropdown.Trigger>
 *    <button>Toggle Dropdown</button>
 *  </Dropdown.Trigger>
 * <Dropdown.Content>
 * <ul>
 * <li>Option 1</li>
 * <li>Option 2</li>
 * <li>Option 3</li>
 * </ul>
 * </Dropdown.Content>
 * </Dropdown>
 * );
 * ```
 *
 */
const Dropdown = forwardRef<DropdownHandle, DropdownProps>(({ children, className }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openDropdown = () => setIsOpen(true);
  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Expose methods via `ref`
  useImperativeHandle(ref, () => ({
    openDropdown,
    closeDropdown,
    toggleDropdown,
  }));

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
      <div ref={dropdownRef} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}) as DropdownComponent;

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;

export default Dropdown;
