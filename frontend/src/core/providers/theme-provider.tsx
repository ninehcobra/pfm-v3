'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

import { useGetPortfolioContentQuery, useGetLanguagesQuery } from '@/core/api/portfolio-api';

export interface LayoutContextType {
  direction: 'ltr' | 'rtl';
  setDirection: (dir: 'ltr' | 'rtl') => void;
  toggleDirection: () => void;
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: { code: string; name: string }[];
  content: any;
  projects: any[];
  experience: any[];
  isLoading: boolean;
  error: any;
  t: (path: string) => any;
}

const LayoutContext = React.createContext<LayoutContextType | undefined>(undefined);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr');
  const [locale, setLocale] = React.useState<string>('auto');
  const [fontFamily, setFontFamily] = React.useState("'Inter', sans-serif");
  const isInitialLoad = React.useRef(true);

  // RTK Query hooks
  const { 
    data: portfolioData, 
    isLoading: isPortfolioLoading, 
    error: portfolioError 
  } = useGetPortfolioContentQuery({ locale: locale === 'auto' ? undefined : locale }, {
    skip: !locale
  });

  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
  } = useGetLanguagesQuery();

  // Load initial locale and direction from localStorage
  React.useEffect(() => {
    const savedLocale = localStorage.getItem('app_locale');
    const savedDir = localStorage.getItem('app_direction') as 'ltr' | 'rtl';
    
    if (savedDir) {
      setDirection(savedDir);
      document.documentElement.dir = savedDir;
    }
    
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  // Sync state when portfolio data returns
  React.useEffect(() => {
    if (portfolioData) {
      const { language } = portfolioData;
      
      // LOGIC: If it's the first fetch, respect saved direction. 
      // If it's a language change, reset to language's default.
      if (isInitialLoad.current) {
        const savedDir = localStorage.getItem('app_direction');
        if (savedDir) {
          setDirection(savedDir as any);
          document.documentElement.dir = savedDir;
        } else {
          setDirection(language.direction as any);
          document.documentElement.dir = language.direction;
        }
        isInitialLoad.current = false;
      } else {
        setDirection(language.direction as any);
        document.documentElement.dir = language.direction;
        localStorage.setItem('app_direction', language.direction);
      }

      setLocale(language.code);
      setFontFamily(language.fontFamily);
      
      localStorage.setItem('app_locale', language.code);
      document.documentElement.lang = language.code;
      document.documentElement.style.fontFamily = language.fontFamily;
    }
  }, [portfolioData]);

  const toggleDirection = () => {
    const newDir = direction === 'ltr' ? 'rtl' : 'ltr';
    setDirection(newDir);
    document.documentElement.dir = newDir;
    localStorage.setItem('app_direction', newDir);
  };

  const t = (path: string) => {
    if (!portfolioData?.content) return path;
    const keys = path.split('.');
    let result: any = portfolioData.content;
    for (const key of keys) {
      result = result?.[key];
    }
    return result || path;
  };

  return (
    <NextThemesProvider {...props}>
      <LayoutContext.Provider value={{ 
        direction, 
        setDirection, 
        toggleDirection, 
        locale, 
        setLocale, 
        availableLocales: languagesData || [],
        content: portfolioData?.content,
        projects: portfolioData?.projects || [],
        experience: portfolioData?.experience || [],
        isLoading: isPortfolioLoading || isLanguagesLoading,
        error: portfolioError,
        t 
      }}>
        {children}
      </LayoutContext.Provider>
    </NextThemesProvider>
  );
}

export const useLayout = () => {
  const context = React.useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a ThemeProvider');
  }
  return context;
};
