import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { mainMenu } from '../../config/menu';
import Button from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import SafeLogotype from "../../assets/logos/safe-logotype.svg?react";


/**
 * @component Main Header Component
 * @description The Main component for the header section of the layout. Includes theme toggle functionality.
 */
const MainHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
      <nav>
        <SafeLogotype className={"w-[85px] h-auto text-black dark:text-white"} />
      </nav>

      <nav className="flex space-x-4">
        {mainMenu
          .filter((item) => item.isVisible)
          .map((item) => (
            <Button asLink size="small" key={item.path} to={item.path} className="flex items-center space-x-2">
              {item.icon && <item.icon />}
              {item.title}
            </Button>
          ))}
      </nav>

      <nav>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full focus:outline-none bg-gray-200 dark:bg-gray-600"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </nav>
    </nav>
  );
};

export default MainHeader;
