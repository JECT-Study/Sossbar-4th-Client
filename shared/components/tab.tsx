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
      if (el) {
        setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      }
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(list, { attributes: true, attributeFilter: ['data-state'], subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Tabs.List ref={listRef} className={cn('relative flex gap-2', className)} {...restProps}>
      {children}
      <span className="bg-border-gray-light absolute right-0 bottom-0 left-0 h-0.75" />
      {indicator !== null && (
        <motion.span
          className="bg-border-secondary absolute bottom-0 h-0.75 w-px origin-left"
          initial={false}
          animate={{ x: indicator.left, scaleX: indicator.width }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      )}
    </Tabs.List>
  );
};

const TabTrigger = ({ className, ...restProps }: ComponentPropsWithRef<typeof Tabs.Trigger>) => {
  return (
    <Tabs.Trigger
      className={cn(
        'h-10 cursor-pointer text-center transition-colors',
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
