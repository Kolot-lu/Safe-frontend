import { ReactNode, useContext } from 'react';
import { FinderContext } from './Finder';
import Button from '../Button';
import { useTranslation } from 'react-i18next';

const translations = 'components.finder.finder_list';

/**
 * @interface FinderListProps
 * @description Props for the FinderList component.
 * @template T - Generic type for options.
 * @property {(option: T) => ReactNode} renderOption - Function to render each option.
 */
interface FinderListProps<T> {
  renderOption: (option: T) => ReactNode;
}

/**
 * @component FinderList
 * @description A component that renders a list of filtered options within the Finder.
 * Provides a way to select options and interact with the Finder context.
 * @template T - Generic type for options.
 */
export const FinderList = <T,>({ renderOption }: FinderListProps<T>) => {
  const { t } = useTranslation();
  const context = useContext(FinderContext);

  if (!context) throw new Error(t(`${translations}.error`));


  /**
   * @function handleSelect
   * @description Handles the selection of an option. Updates the Finder context and closes the dropdown.
   * @param {T} option - The selected option.
   */
  const handleSelect = (option: T) => {
    context.onSelect(option);
    context.dropdownRef.current?.closeDropdown();
  };

  return (
    <ul
      className="flex flex-col gap-y-1 p-2 mt-2 max-h-60 overflow-y-auto"
      role="listbox"
      aria-label={t(`${translations}.aria_label`)}
    >
      {context.filteredOptions.length > 0 &&
        context.filteredOptions.map((option, index) => (
          <li key={index}>
            <Button
              variant="ghost"
              size="small"
              type="button"
              className="w-full justify-start"
              tabIndex={0}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
            >
              {renderOption(option)}
            </Button>
          </li>
        ))}
    </ul>
  );
};
