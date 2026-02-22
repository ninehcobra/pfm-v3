'use client';

import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`relative inline-block overflow-hidden [background-clip:text] [-webkit-background-clip:text] ${
        disabled ? '' : 'animate-shiny'
      } ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(var(--foreground), 0) 0%, rgba(var(--foreground), 0) 40%, var(--foreground) 50%, rgba(var(--foreground), 0) 60%, rgba(var(--foreground), 0) 100%)',
        backgroundSize: '200% 100%',
        color: 'currentColor',
        opacity: 0.8,
        animationDuration,
      }}
    >
      {text}
      <style jsx>{`
        .animate-shiny {
          animation: shiny linear infinite;
        }
        @keyframes shiny {
          from {
            background-position: 200% 0;
          }
          to {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};
