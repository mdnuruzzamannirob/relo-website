'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils/cn';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'border-brand-100 inline-flex h-9 w-full items-center rounded-lg border-b',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "dark:data-[state=active]:text-primary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-primary hover:text-primary inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-4 text-sm font-normal whitespace-nowrap text-slate-500 shadow-none ring-0 ring-offset-0 transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
