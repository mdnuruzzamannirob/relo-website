'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

function SelectViewport(
  { className, ...props }: React.HTMLAttributes<HTMLDivElement>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={cn('bg-popover overflow-hidden rounded-md border', className)}
      {...props}
    />
  );
}

export const SelectViewportComponent = React.forwardRef(SelectViewport);
SelectViewportComponent.displayName = 'SelectViewport';
