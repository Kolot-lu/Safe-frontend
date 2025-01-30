import { createContext, useState, ReactNode, useRef, useMemo } from 'react';
import Dropdown, { DropdownHandle } from '../Dropdown/Dropdown';
import { FinderInput } from './FinderInput';
import { FinderList } from './FinderList';
import { FinderEmpty } from './FinderEmpty';

/**
 * @interface FinderContextProps
 * @description Context interface for managing Finder state and providing shared functionality across Finder components.
 * @template T - Generic type for options.
 */
interface FinderContextProps<T> {
  options: T[];
  filteredOptions: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelect: (option: T) => void;
  dropdownRef: React.RefObject<DropdownHandle>;
}

/**
 * @constant FinderContext
 * @description React context for managing Finder state.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FinderContext = createContext<FinderContextProps<any> | null>(null);

/**
 * @interface FinderProps
 * @description Props for the Finder component.
 * @template T - Generic type for options.
 * @property {T[]} options - List of options to be filtered and displayed.
 * @property {(option: T) => void} onSelect - Callback triggered when an option is selected.
 * @property {ReactNode} children - Child components to render within the Finder.
 */
interface FinderProps<T> {
  options: T[];
  onSelect: (option: T) => void;
  children: ReactNode;
}

/**
 * @component Finder
 * @description A composable component for filtering and selecting options from a dropdown list.
 * @template T - Generic type for options.
 */
export const Finder = <T,>({ options, onSelect, children }: FinderProps<T>) => {

  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<DropdownHandle>(null);

  /**
   * @constant filteredOptions
   * @description Memoized list of options filtered based on the current search query.
   */
  const filteredOptions = useMemo(
    () => options.filter((option) => JSON.stringify(option).toLowerCase().includes(searchQuery.toLowerCase())),
    [options, searchQuery]
  );

  return (
    <FinderContext.Provider
      value={{
        options,
        filteredOptions,
        searchQuery,
        setSearchQuery,
        onSelect,
        dropdownRef,
      }}
    >
      <Dropdown ref={dropdownRef}>{children}</Dropdown>
    </FinderContext.Provider>
  );
}

/**
 * @property {React.FC} Finder.Trigger - Trigger component to open the Finder dropdown.
 * @property {React.FC} Finder.Content - Content container for Finder components like Input and List.
 * @property {React.FC} Finder.Input - Input field for searching options within the Finder.
 * @property {React.FC} Finder.List - List of filtered options.
 * @property {React.FC} Finder.Empty - Fallback content displayed when no options match the search query.
 */
Finder.Trigger = Dropdown.Trigger;
Finder.Content = Dropdown.Content;
Finder.Input = FinderInput;
Finder.List = FinderList;
Finder.Empty = FinderEmpty;
