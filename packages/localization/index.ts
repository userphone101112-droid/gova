// @gv/localization
export const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

export function getDirection(lang: string) {
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
}
