'use client';

import type { ComponentProps } from 'react';

import Link from 'next/link';

import { useProtectedLinkClick } from './use-protected-link-click';

type ProtectedLinkProps = ComponentProps<typeof Link>;

export const ProtectedLink = ({ href, onClick, children, className, ref, ...restProps }: ProtectedLinkProps) => {
  const handleClick = useProtectedLinkClick(onClick);

  return (
    <Link ref={ref} href={href} onClick={handleClick} className={className} {...restProps}>
      {children}
    </Link>
  );
};
