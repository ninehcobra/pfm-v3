'use client';

import * as React from 'react';
import { useLayout } from '@/core/providers/theme-provider';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { locale, setLocale, availableLocales } = useLayout();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-all border border-border text-xs font-bold uppercase tracking-wider"
        aria-label="Toggle language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{locale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
          {availableLocales.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-xs font-bold uppercase hover:bg-muted transition-colors ${
                locale === lang.code ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
