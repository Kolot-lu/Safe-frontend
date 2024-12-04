import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { mainMenu } from '../../config/menu';
import Button from '../ui/Button';
import SafeLogotype from '../../assets/logos/safe-logotype.svg?react';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';
import WalletConnect from '../WalletConnect';
import { Menu } from 'lucide-react';
import Modal, { ModalHandle } from '../ui/Modal/Modal';
import Hr from '../ui/Hr';
import { useTranslation } from 'react-i18next';

const translations = 'components.header.main_header';

/**
 * @component MainHeader
 * @description The main header component for the application.
 * Displays the logo, main menu, and utility buttons.
 */
const MainHeader: React.FC = () => {
  const modalRef = useRef<ModalHandle>(null);
  const { t } = useTranslation();

  /**
   * @function renderMenuItems
   * @description Renders the menu items based on visibility.
   * @returns {JSX.Element[]} Array of menu item buttons.
   */
  const renderMenuItems = () =>
    mainMenu
      .filter((item) => item.isVisible)
      .map((item) => (
        <Button
          asLink
          variant="link"
          size="small"
          key={item.path}
          to={item.path}
          className="justify-start"
          aria-current={window.location.pathname === item.path ? 'page' : undefined}
          onClick={() => modalRef.current?.closeModal()}
        >
          {item.icon && <item.icon />}
          {item.title}
        </Button>
      ));

  return (
    <nav className="w-full flex items-center justify-between py-2 px-3 rounded-md bg-gray-100 dark:bg-dark-400 border border-border-light dark:border-border-dark">
      {/* Logo Section */}
      <div>
        <Link
          to="/"
          aria-label={t(`${translations}.accessibility.logotype.link_label`)}
          aria-current={window.location.pathname === '/' ? 'page' : undefined}
          className="focus:outline-none"
        >
          <SafeLogotype
            role="img"
            aria-hidden="false"
            aria-label={t(`${translations}.accessibility.logotype.logo_label`)}
            className="w-[75px] h-auto text-black dark:text-white"
          />
        </Link>
      </div>

      {/* Main Menu for Desktop */}
      <div className="hidden md:flex space-x-4">{renderMenuItems()}</div>

      {/* Utility Buttons */}
      <div className="flex items-center md:gap-4">
        {/* Mobile Menu Modal */}
        <Modal className="md:hidden" modalRef={modalRef}>
          <Modal.Trigger>
            <Button size="small" rounded aria-label={t(`${translations}.accessibility.open_menu`)}>
              <Menu />
            </Button>
          </Modal.Trigger>

          <Modal.Content isCloseable className="flex flex-col gap-2">
            {renderMenuItems()}
            <Hr className="my-2" />
            <div className="flex items-center justify-between">
              <WalletConnect />
              <div className="flex gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </div>
          </Modal.Content>
        </Modal>

        {/* Desktop Utility Buttons */}
        <WalletConnect className="hidden md:flex" />
        <LanguageSwitcher className="hidden md:block" />
        <ThemeSwitcher className="hidden md:block" />
      </div>
    </nav>
  );
};

export default MainHeader;
