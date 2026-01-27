'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TabPanelProps {
  value: string;
  active: string;
  children: React.ReactNode;
  className?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ value, active, className, children }) => {
  if (value !== active) return null;
  return (
    <div
      id={`panel-${value}`}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      className={cn('space-y-4', className)}
    >
      {children}
    </div>
  );
};

export default TabPanel;
