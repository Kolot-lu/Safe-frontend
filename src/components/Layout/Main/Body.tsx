import { cn } from '../../../utils/cn';

/**
 * @component Body
 * @description A layout component that wraps the main content of the page.
 *
 * @param {React.ComponentProps<'main'>} props - The standard props for an HTML <main> element.
 * @returns {JSX.Element} The rendered <main> element with combined styles.
 */
export const Body: React.FC<React.ComponentProps<'main'>> = (props) => {
  return <main {...props} className={cn(props.className, 'flex justify-center w-full min-w-[600px]')} role="main" />;
};
