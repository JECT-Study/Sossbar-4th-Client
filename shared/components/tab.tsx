'use client';

import type { ComponentPropsWithRef } from 'react';

import { motion } from 'motion/react';
import { Tabs } from 'radix-ui';
import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

const TabRoot = ({ className, ...restProps }: ComponentPropsWithRef<typeof Tabs.Root>) => {
  return <Tabs.Root className={cn('w-full', className)} {...restProps} />;
};

const TabList = ({ className, children, ...restProps }: ComponentPropsWithRef<typeof Tabs.List>) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const update = () => {
      const el = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!el) {
        return;
      }

      const left = el.offsetLeft;
      const width = el.offsetWidth;
      const maxWidth = list.clientWidth - left;

      setIndicator({ left, width: Math.min(width, maxWidth) });
    };

    update();

    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(list, { attributes: true, attributeFilter: ['data-state'], subtree: true });

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(list);
    list.querySelectorAll('[role="tab"]').forEach((tab) => resizeObserver.observe(tab));

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Tabs.List ref={listRef} className={cn('relative flex gap-2 overflow-hidden', className)} {...restProps}>
      {children}
      <span className="bg-border-gray-light absolute right-0 bottom-0 left-0 h-0.75" aria-hidden />
      {indicator !== null ? (
        <motion.span
          className="bg-border-secondary absolute bottom-0 left-0 h-0.75"
          initial={false}
          animate={{ left: indicator.left, width: indicator.width }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          aria-hidden
        />
      ) : null}
    </Tabs.List>
  );
};

const TabTrigger = ({ className, ...restProps }: ComponentPropsWithRef<typeof Tabs.Trigger>) => {
  return (
    <Tabs.Trigger
      className={cn(
        'h-16 cursor-pointer text-center transition-colors',
        'text-text-subtle data-[state=active]:text-text-secondary',
        'text-heading-sm px-3 font-bold',
        className,
      )}
      {...restProps}
    />
  );
};

const TabContent = ({ className, ...restProps }: ComponentPropsWithRef<typeof Tabs.Content>) => {
  return <Tabs.Content className={className} {...restProps} />;
};

export const Tab = {
  Root: TabRoot,
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
};
