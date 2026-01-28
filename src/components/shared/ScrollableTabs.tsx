'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

type TabItem = {
  value: string;
  label: string;
};

export interface ScrollableTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ScrollableTabs: React.FC<ScrollableTabsProps> = ({ tabs, value, onChange, className }) => {
  return (
    <div className={cn('w-full', className)}>
      <div
        className="inline-flex h-9 w-full items-center overflow-x-auto rounded-lg border-b whitespace-nowrap sm:overflow-visible"
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              id={`tab-${t.value}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${t.value}`}
              onClick={() => onChange(t.value)}
              className={cn(
                "focus-visible:ring-ring/50 inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm font-normal whitespace-nowrap text-slate-500 shadow-none ring-0 ring-offset-0 transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                active ? 'text-primary border-b-primary font-medium' : 'hover:text-primary',
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollableTabs;
