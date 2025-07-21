'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  bgColorProgressIndicator,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  bgColorProgressIndicator: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn(
        'bg-slate-200 relative h-1.5 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={`${bgColorProgressIndicator} h-full w-full flex-1 transition-all`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
