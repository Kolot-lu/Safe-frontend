import { useEffect, useState } from 'react';

/**
 * @hook useTheme
 * @description Manages the application's theme (light/dark) and persists the user's preference in localStorage.
 *
 * @returns {object} - The current theme and a function to toggle between themes.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load the theme from localStorage or system preferences on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return { theme, toggleTheme };
};
