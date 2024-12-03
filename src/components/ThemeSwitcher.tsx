import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Button from './ui/Button';

/**
 * @component ThemeSwitcher
 * @description A toggle button that switches between light and dark themes. The button displays
 * either a sun or moon icon based on the current theme.
 *
 * @example
 * <ThemeSwitcher />
 *
 * @returns {JSX.Element} The rendered ThemeSwitcher component.
 */
const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      size="small"
      rounded
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className={className}
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  );
};

export default ThemeSwitcher;
