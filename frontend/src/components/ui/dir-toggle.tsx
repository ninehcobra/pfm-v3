'use client';

import * as React from 'react';
import { useLayout } from '@/core/providers/theme-provider';
import { Languages } from 'lucide-react';

export function DirectionToggle() {
  const { direction, toggleDirection } = useLayout();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleDirection}
      className="flex items-center gap-2 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
      aria-label="Toggle layout direction"
    >
      <Languages className="w-5 h-5" />
      <span>{direction.toUpperCase()}</span>
    </button>
  );
}
