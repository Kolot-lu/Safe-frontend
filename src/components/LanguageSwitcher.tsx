import React from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';
import Dropdown from './ui/Dropdown/Dropdown';
import Button from './ui/Button';

const translations = 'components.language_switcher';

/**
 * @component LanguageSwitcher
 * @description Component to switch between languages. Uses i18next to manage translations.
 */
const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button
          variant="ghost"
          rounded
          size="small"
          className={className}
          aria-label={t(`${translations}.accessibility.switch_language`, { language: i18n.language })}
        >
          {i18n.language}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        {languages.map((language) => (
          <Button
            key={language}
            onClick={() => changeLanguage(language)}
            role="menuitem"
            aria-label={t(`${translations}.accessibility.label`, { language: language })}
            size="small"
            variant={i18n.resolvedLanguage === language ? 'primary' : 'ghost'}
          >
            {language}
          </Button>
        ))}
      </Dropdown.Content>
    </Dropdown>
  );
};

export default LanguageSwitcher;
