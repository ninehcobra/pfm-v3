'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLayout } from '@/core/providers/theme-provider';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { direction } = useLayout();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className={`fixed bottom-28 ${direction === 'ltr' ? 'right-8' : 'left-8'} z-[60] w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-90 group`}
        >
          <div className="relative overflow-hidden w-6 h-6">
            <ArrowUp className="w-6 h-6 absolute transition-transform duration-500 group-hover:-translate-y-10" />
            <ArrowUp className="w-6 h-6 absolute translate-y-10 transition-transform duration-500 group-hover:translate-y-0" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
