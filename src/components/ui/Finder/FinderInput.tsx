import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { FinderContext } from './Finder';
import Input from '../Input';

const translations = 'components.finder.finder_input';

/**
 * @interface FinderInputProps
 * @description Props for the FinderInput component.
 * @property {string} [placeholder] - Placeholder text for the input field.
 * @property {string} [className] - Additional class names for customizing the input field.
 * @property {React.ComponentProps<typeof Input>} [inputProps] - Additional props to pass to the Input component.
 */
interface FinderInputProps extends React.ComponentProps<typeof Input> {
  placeholder?: string;
}

/**
 * @component FinderInput
 * @description Input field for the Finder component, allowing users to search options. Supports localization and customization.
 * @param {string} [placeholder] - Placeholder text for the input field.
 * @param {string} [className] - Additional class names for customizing the input field.
 * @param {React.ComponentProps<typeof Input>} [props] - Additional props passed to the underlying Input component.
 * 
 * @example
 * <FinderInput placeholder="Search tokens..." />
 */
export const FinderInput = ({ placeholder = 'Search...', className, ...props }: FinderInputProps) => {
  const { t } = useTranslation();
  const context = useContext(FinderContext);

  if (!context) throw new Error(t(`${translations}.error`));

  return (
    <Input
      type="text"
      value={context.searchQuery}
      onChange={(e) => context.setSearchQuery(e.target.value)}
      placeholder={placeholder || t(`${translations}.placeholder`)}
      aria-label={props['aria-label'] || t(`${translations}.aria_label`)}
      icon={<Search />}
      className={className}
      {...props}
    />
  );
};
