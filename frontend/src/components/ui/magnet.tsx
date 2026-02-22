'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MagnetProps {
  children: React.ReactNode;
  distance?: number;
  strength?: number;
  active?: boolean;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  distance = 100,
  strength = 30,
  active = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!ref.current || !active) return;

      const { clientX, clientY } = event;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (dist < distance) {
        setIsHovered(true);
        const intensity = (1 - dist / distance) * strength;
        x.set(deltaX * (intensity / strength) * 0.5);
        y.set(deltaY * (intensity / strength) * 0.5);
      } else {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [distance, strength, active, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
