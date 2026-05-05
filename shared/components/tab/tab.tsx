'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

import { TabAtomic } from './tab-atomic';

interface Props {
  items: readonly string[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Tab = ({ items, value, onChange, variant = 'primary', className }: Props) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const activeIndex = items.indexOf(value);
    const el = refs.current[activeIndex];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [value, items]);

  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex gap-1" role="tablist">
        {items.map((item, i) => (
          <TabAtomic
            key={item}
            ref={(el) => {
              refs.current[i] = el;
            }}
            variant={variant}
            active={value === item}
            onClick={() => onChange(item)}
          >
            {item}
          </TabAtomic>
        ))}
        {variant === 'primary' && (
          <span
            className="bg-border-secondary absolute bottom-0 h-0.75 transition-[left,width] duration-200"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
      </div>
      {variant === 'primary' && <hr className="border-border-gray-light border-4" />}
    </div>
  );
};
