'use client';

import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

export const Popover = RadixPopover.Root;

export const PopoverTrigger = RadixPopover.Trigger;

export const PopoverContent = ({ className, align = 'center', sideOffset = 4, ...props }) => (
  <RadixPopover.Portal>
    <RadixPopover.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border border-neutral-200 bg-white p-4 text-neutral-900 shadow-md outline-none dark:bg-neutral-800 dark:text-white dark:border-neutral-700',
        className
      )}
      {...props}
    />
  </RadixPopover.Portal>
);
