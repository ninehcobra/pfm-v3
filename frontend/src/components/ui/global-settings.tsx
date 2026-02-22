'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/core/providers/theme-provider';
import { useTheme } from 'next-themes';
import { 
  Settings, 
  X, 
  Globe, 
  Sun, 
  Moon, 
  AlignLeft, 
  AlignRight,
  Monitor,
  Check,
  ChevronRight
} from 'lucide-react';

export function GlobalSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    locale, 
    setLocale, 
    availableLocales, 
    direction, 
    toggleDirection 
  } = useLayout();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`fixed bottom-8 ${direction === 'ltr' ? 'right-8' : 'left-8'} z-[9999]`}>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.3)] flex items-center justify-center hover:shadow-[0_0_50px_rgba(var(--primary),0.5)] transition-all z-50 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="settings" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
              <Settings className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, x: direction === 'ltr' ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: direction === 'ltr' ? 20 : -20 }}
              className={`absolute bottom-20 ${direction === 'ltr' ? 'right-0' : 'left-0'} w-80 bg-background/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden`}
            >
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    Language Selection
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {availableLocales.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code)}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                          locale === lang.code 
                            ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20' 
                            : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="text-sm uppercase tracking-wider">{lang.name}</span>
                        {locale === lang.code && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Sun className="w-3 h-3" />
                    Appearance & Layout
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-2 group"
                    >
                      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 italic">Toggle Theme</span>
                    </button>
                    <button
                      onClick={toggleDirection}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-2 group"
                    >
                      {direction === 'ltr' ? <AlignRight className="w-5 h-5" /> : <AlignLeft className="w-5 h-5" />}
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 italic">{direction.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary/5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Antigravity Systems • v2.0</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
