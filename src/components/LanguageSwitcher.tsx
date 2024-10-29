import React from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';
import Dropdown from './ui/Dropdown/Dropdown';


/**
 * @component LanguageSwitcher
 * @description Component to switch between languages. Uses i18next to manage translations.
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <span>{i18n.language}</span>
      </Dropdown.Trigger>
      <Dropdown.Content>
        {languages.map((language) => (
          <button
            key={language}
            onClick={() => changeLanguage(language)}
            role="menuitem"
            className={`block w-full px-4 py-2 text-left ${
              i18n.resolvedLanguage === language ? 'bg-blue-500 text-white' : 'bg-white text-black dark:bg-gray-800 dark:text-white'
            }`}
          >
            {language}
          </button>
        ))}
      </Dropdown.Content>
    </Dropdown>
  );
};

export default LanguageSwitcher;
