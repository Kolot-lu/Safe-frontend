import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn';

/**
 * @component Footer
 * @description A layout component for the footer section of the page.
 *
 * @param {React.ComponentProps<'footer'>} props - The standard props for an HTML <footer> element.
 * @returns {JSX.Element} The rendered <footer> element with combined styles.
 */
export const Footer: React.FC<React.ComponentProps<'footer'>> = (props) => {
  const { t } = useTranslation();

  // Translation keys
  const translationAccessibility = 'components.layouts.main.footer.accessibility';
  return (
    <footer
      {...props}
      className={cn(props.className, 'container mx-auto')}
      aria-label={t(`${translationAccessibility}.label`)}
    />
  );
};
