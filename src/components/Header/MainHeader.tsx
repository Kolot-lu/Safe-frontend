import React from 'react';
import { Link } from 'react-router-dom';
import { mainMenu } from '../../config/menu';
import Button from '../ui/Button';
import SafeLogotype from '../../assets/logos/safe-logotype.svg?react';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';

/**
 * @component Main Header Component
 * @description The Main component for the header section of the layout. Includes theme toggle functionality.
 */
const MainHeader: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between py-2 px-3 rounded-md my-3 bg-gray-100 dark:bg-dark-400 border border-border-light dark:border-border-dark">
      <nav>
        <Link to={'/'}>
          <SafeLogotype className={'w-[75px] h-auto text-black dark:text-white'} />
        </Link>
      </nav>

      <nav className="flex space-x-4">
        {mainMenu
          .filter((item) => item.isVisible)
          .map((item) => (
            <Button asLink variant="link" size="small" key={item.path} to={item.path}>
              {item.icon && <item.icon />}
              {item.title}
            </Button>
          ))}
      </nav>

      <nav className="flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </nav>
    </nav>
  );
};

export default MainHeader;
