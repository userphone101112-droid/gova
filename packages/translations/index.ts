// @gv/translations
export const translations = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
  },
  ar: {
    welcome: 'مرحباً',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en'];

export function getTranslation(lang: Language, key: TranslationKey) {
  return translations[lang][key] || key;
}
