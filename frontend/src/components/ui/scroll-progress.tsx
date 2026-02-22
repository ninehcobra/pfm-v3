'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface Milestone {
  id: string;
  label: string;
}

interface ScrollProgressProps {
  milestones: Milestone[];
}

export function ScrollProgress({ milestones }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState(milestones[0]?.id);

  useEffect(() => {
    const observers = milestones.map((m) => {
      const el = document.getElementById(m.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(m.id);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((o) => o?.disconnect());
    };
  }, [milestones]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Side Milestones */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6 items-end">
        {milestones.map((m) => (
          <button
            key={m.id}
            onClick={() => scrollTo(m.id)}
            className="group flex items-center gap-4 transition-all outline-none select-none cursor-pointer"
          >
            <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 select-none ${
              activeSection === m.id ? 'text-primary opacity-100 translate-x-0' : 'text-muted-foreground opacity-0 translate-x-4 group-hover:opacity-50 group-hover:translate-x-2'
            }`}>
              {m.label}
            </span>
            <div className={`relative w-3 h-3 rounded-full border-2 transition-all duration-500 select-none ${
              activeSection === m.id 
                ? 'bg-primary border-primary scale-125 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' 
                : 'border-muted-foreground/30 group-hover:border-primary/50'
            }`}>
              {activeSection === m.id && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute inset-[-4px] rounded-full border border-primary/30"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
