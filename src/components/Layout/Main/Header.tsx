import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn';

/**
 * @component Header
 * @description A layout component for the header section of the page.
 *
 * @param {React.ComponentProps<'header'>} props - The standard props for an HTML <header> element.
 * @returns {JSX.Element} The rendered <header> element with combined styles.
 */
export const Header: React.FC<React.ComponentProps<'header'>> = (props) => {
  const { t } = useTranslation();

  // Translation keys
  const translationAccessibility = 'components.layouts.main.header.accessibility';
  return (
    <header
      {...props}
      className={cn(props.className, 'w-full max-w-screen-2xl p-3 mx-auto')}
      aria-label={t(`${translationAccessibility}.label`)}
    />
  );
};
