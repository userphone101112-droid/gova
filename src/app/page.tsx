'use client';

import * as React from 'react';
import { useUIStore } from '@/store';
import { getTranslation, Language, type TranslationKey } from '@gv/translations';
import { getDirection } from '@gv/localization';
import { getBrandConfig } from '@gv/branding';
import { Button, Card } from '@gv/design-system';

export default function Home() {
  const { language, theme, setLanguage, setTheme } = useUIStore();

  // Dynamic brand configuration
  const brand = getBrandConfig('brandB'); // Use Suez Connect as demo brand

  // Toggle language helper
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  // Toggle theme helper
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Sync html class with theme state
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const dir = getDirection(language);

  // Safe translations
  const t = (key: TranslationKey) => getTranslation(language as Language, key);

  return (
    <div
      dir={dir}
      className="flex flex-col flex-1 items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 font-sans p-6"
    >
      <main className="flex flex-col items-center max-w-2xl w-full gap-8">
        {/* Brand Header */}
        <Card className="w-full flex flex-col items-center text-center gap-4 border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-md)]">
          <div className="flex w-full justify-between items-center border-b border-[var(--border)] pb-4 mb-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleLanguage}>
                {language === 'en' ? 'العربية' : 'English'}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </Button>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
              SSOT Active
            </span>
          </div>

          <div className="relative w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold">
            🚢
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--primary)]">
            {brand.appName}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-md">{brand.description}</p>
        </Card>

        {/* Translation Demonstration */}
        <Card className="w-full flex flex-col gap-4">
          <h2 className="text-xl font-bold border-b border-[var(--border)] pb-2">
            {language === 'en' ? 'Localization & Translation SSOT' : 'نظام الترجمة والتوطين الموحد'}
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded bg-[var(--muted)]">
              <span className="block text-xs text-[var(--muted-foreground)] mb-1">
                Key: common.welcome
              </span>
              <strong className="text-base">{t('common.welcome')}</strong>
            </div>
            <div className="p-3 rounded bg-[var(--muted)]">
              <span className="block text-xs text-[var(--muted-foreground)] mb-1">
                Key: common.login
              </span>
              <strong className="text-base">{t('common.login')}</strong>
            </div>
            <div className="p-3 rounded bg-[var(--muted)]">
              <span className="block text-xs text-[var(--muted-foreground)] mb-1">
                Key: common.logout
              </span>
              <strong className="text-base">{t('common.logout')}</strong>
            </div>
            <div className="p-3 rounded bg-[var(--muted)]">
              <span className="block text-xs text-[var(--muted-foreground)] mb-1">
                Key: products.addProduct
              </span>
              <strong className="text-base">{t('products.addProduct')}</strong>
            </div>
          </div>
        </Card>

        {/* Actions demo */}
        <div className="flex w-full gap-4 justify-stretch">
          <Button variant="primary" size="lg" className="flex-1">
            {t('common.confirm')}
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            {t('common.cancel')}
          </Button>
        </div>
      </main>
    </div>
  );
}
