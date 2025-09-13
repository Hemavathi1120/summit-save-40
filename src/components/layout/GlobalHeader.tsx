import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';

export function GlobalHeader() {
  return (
    <div className="fixed top-0 right-0 m-4 z-50">
      <div className="backdrop-blur-sm bg-background/30 p-1.5 rounded-full shadow-sm hover:shadow-md transition-all">
        <ThemeToggle />
      </div>
    </div>
  );
}
