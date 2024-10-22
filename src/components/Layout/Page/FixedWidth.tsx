import { cn } from '../../../utils/cn';

/**
 * @component FixedWidth
 * @description A layout component that constrains content to a fixed width container.
 * 
 * @param {React.ComponentProps<'div'>} props - The standard props for an HTML <div> element.
 * @returns {JSX.Element} The rendered fixed-width <section> element.
 */
export const FixedWidth: React.FC<React.ComponentProps<'section'>> = (props) => {
  return <section {...props} className={cn(props.className, 'container w-auto')} />;
};
