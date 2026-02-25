'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Award, Zap, ThumbsUp } from 'lucide-react';

interface Props {
  type: string;
  trigger: boolean;
}

const Particle = ({ icon: Icon, color }: { icon: any, color: string }) => {
  const [coords] = React.useState(() => ({
    x: Math.random() * 100 - 50,
    y: -(Math.random() * 100 + 50),
    rotate: Math.random() * 360
  }));

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
      animate={{ 
        opacity: 0, 
        scale: 1, 
        x: coords.x, 
        y: coords.y, 
        rotate: coords.rotate 
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`absolute pointer-events-none ${color}`}
    >
      <Icon className="w-4 h-4" />
    </motion.div>
  );
};

export const ReactionEffects = ({ type, trigger }: Props) => {
  const [particles, setParticles] = React.useState<{ id: number }[]>([]);

  React.useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i
      }));
      setParticles(prev => [...prev, ...newParticles]);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const getEffect = () => {
    switch (type) {
      case 'LOVE':
        return { icon: Heart, color: 'text-red-500' };
      case 'BRAVO':
        return { icon: Award, color: 'text-green-500' };
      case 'WOW':
        return { icon: Zap, color: 'text-yellow-500' };
      case 'LIKE':
        return { icon: ThumbsUp, color: 'text-blue-500' };
      default:
        return null;
    }
  };

  const effect = getEffect();
  if (!effect) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <AnimatePresence>
        {particles.map(p => (
          <Particle key={p.id} icon={effect.icon} color={effect.color} />
        ))}
      </AnimatePresence>
    </div>
  );
};
