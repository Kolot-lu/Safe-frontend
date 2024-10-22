import { cn } from '../../../utils/cn';

/**
 * @component FullWidth
 * @description A layout component that stretches content to the full width of the viewport.
 * 
 * @param {React.ComponentProps<'div'>} props - The standard props for an HTML <div> element.
 * @returns {JSX.Element} The rendered full-width <section> element.
 */
export const FullWidth: React.FC<React.ComponentProps<'section'>> = (props) => {
  return <section {...props} className={cn(props.className, 'w-full')} />;
};
