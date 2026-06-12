// @gv/localization

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const supportedLanguages: Record<string, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
  },
};

export const defaultLanguage = 'en';

export const LANGUAGE_STORAGE_KEY = 'gv-lang-pref';

export function getLanguageInfo(code: string): LanguageInfo {
  return supportedLanguages[code] || supportedLanguages[defaultLanguage]!;
}

export function getDirection(code: string): 'ltr' | 'rtl' {
  return getLanguageInfo(code).dir;
}

export function isRtl(code: string): boolean {
  return getDirection(code) === 'rtl';
}
