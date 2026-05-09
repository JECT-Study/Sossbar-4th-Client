import type { ComponentProps } from 'react';

import { cn } from '../lib/cn';

export const PageContainer = ({ children, className }: ComponentProps<'div'>) => {
  return <section className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-0', className)}>{children}</section>;
};
