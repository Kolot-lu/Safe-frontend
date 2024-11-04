import React from 'react';
import { Link } from 'react-router-dom';
import { mainMenu } from '../../config/menu';
import Button from '../ui/Button';
import SafeLogotype from '../../assets/logos/safe-logotype.svg?react';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';
import WalletConnect from '../WalletConnect';
import { Menu } from 'lucide-react';
import Modal from '../ui/Modal/Modal';

/**
 * @component Main Header Component
 * @description The Main component for the header section of the layout. Includes theme toggle functionality.
 */
const MainHeader: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between py-2 px-3 rounded-md bg-gray-100 dark:bg-dark-400 border border-border-light dark:border-border-dark">
      <nav>
        <Link to={'/'}>
          <SafeLogotype className={'w-[75px] h-auto text-black dark:text-white'} />
        </Link>
      </nav>

      <nav className="hidden md:flex space-x-4">
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
      <Modal className="md:hidden">
        <Modal.Trigger>
          <Button size="small" rounded>
            <Menu />
          </Button>
        </Modal.Trigger>
        <Modal.Content className='flex flex-col'>
 
          {mainMenu
            .filter((item) => item.isVisible)
            .map((item) => (
              <Button asLink variant="link" className='justify-start' key={item.path} to={item.path}>
                {item.icon && <item.icon />}
                {item.title}
              </Button>
            ))}

                    <WalletConnect />
        <LanguageSwitcher />
        <ThemeSwitcher />
        
        </Modal.Content>
      </Modal>

        <WalletConnect />
        <LanguageSwitcher />
        <ThemeSwitcher />
      </nav>
    </nav>
  );
};

export default MainHeader;
