'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

import api from '@/core/api/api-client';

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
  const [locale, setLocale] = React.useState<string>('en');
  const [availableLocales, setAvailableLocales] = React.useState([]);
  const [content, setContent] = React.useState<any>(null);
  const [projects, setProjects] = React.useState([]);
  const [experience, setExperience] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(null);
  const [fontFamily, setFontFamily] = React.useState("'Inter', sans-serif");
  const isInitialLoad = React.useRef(true);

  // Load initial locale and direction from localStorage
  React.useEffect(() => {
    const savedLocale = localStorage.getItem('app_locale');
    const savedDir = localStorage.getItem('app_direction') as 'ltr' | 'rtl';
    
    if (savedDir) {
      setDirection(savedDir);
      document.documentElement.dir = savedDir;
    }
    
    setLocale(savedLocale || 'auto'); 
  }, []);

  const toggleDirection = () => {
    const newDir = direction === 'ltr' ? 'rtl' : 'ltr';
    setDirection(newDir);
    document.documentElement.dir = newDir;
    localStorage.setItem('app_direction', newDir);
  };

  const fetchData = async (targetLocale: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = targetLocale === 'auto' ? '/portfolio' : `/portfolio?locale=${targetLocale}`;
      const [portfolioRes, langsRes] = await Promise.all([
        api.get(url),
        api.get('/portfolio/languages')
      ]);

      const { language, content: uiContent, projects: pList, experience: eList } = portfolioRes.data;
      
      setContent(uiContent);
      setProjects(pList);
      setExperience(eList);
      
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
      setAvailableLocales(langsRes.data);
      
      localStorage.setItem('app_locale', language.code);
      document.documentElement.lang = language.code;
      document.documentElement.style.fontFamily = language.fontFamily;
    } catch (err) {
      console.error('Failed to fetch portfolio content:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (locale) {
      fetchData(locale);
    }
  }, [locale]);

  const t = (path: string) => {
    if (!content) return path;
    const keys = path.split('.');
    let result: any = content;
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
        availableLocales,
        content,
        projects,
        experience,
        isLoading,
        error,
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
