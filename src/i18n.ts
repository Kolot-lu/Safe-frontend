import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from '../src/locales/en.json';
import translationFR from '../src/locales/fr.json';

/**
 * Resources object containing language-specific translations.
 * Each key corresponds to a language code (e.g., 'en' for English, 'fr' for French).
 */
const resources = {
  en: {
    translation: translationEN, // English translations
  },
  fr: {
    translation: translationFR, // French translations
  },
};

/**
 * i18n configuration for initializing internationalization.
 * 
 * Key points:
 * - `use(LanguageDetector)`: Automatically detects the user's language preference (browser or system).
 * - `use(initReactI18next)`: Enables i18n for React applications.
 * - `resources`: The translations are defined in JSON files for each language.
 * - `fallbackLng`: Specifies the default language to fall back on when no matching language is found.
 * - `supportedLngs`: Defines which languages are supported.
 * - `load: 'all'`: Ensures all translations are loaded regardless of the current language.
 * - `debug`: Enables console logs for debugging (set to `true` in development).
 */
i18n
  .use(LanguageDetector) // Automatically detect the user's preferred language
  .use(initReactI18next) // Initialize React-specific i18next functionality
  .init({
    fallbackLng: 'en', // Fallback language if the user's language is not supported
    supportedLngs: ['en', 'fr'], // List of supported languages
    load: 'all', // Load all translations in the background, regardless of the selected language
    debug: true, // Debug mode for development, disable in production
    resources, // Language resource files containing the translations
  });

export default i18n;
