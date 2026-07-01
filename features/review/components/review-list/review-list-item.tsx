'use client';

import type { ReactNode } from 'react';

import { useLayoutEffect, useRef, useState } from 'react';

import { EllipsisVerticalIcon, EmergencyIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/components/button';
import { Dropdown } from '@/shared/components/dropdown';
import { REPORT_FORM_URL } from '@/shared/constants/report';
import { cn } from '@/shared/lib/cn';

import type { UserPosition } from '../../review.types';

import { getUserPositionLabel } from '../../review.lib';

interface RootProps {
  children: ReactNode;
  action?: ReactNode;
}

const ReviewListItemRoot = ({ children, action }: RootProps) => (
  <li className="border-border-gray border-b py-6 first:pt-0 last:border-b-0">
    <div className={cn(action && 'flex items-start gap-9')}>
      <article className={cn('min-w-0', action ? 'flex-1' : 'relative')}>{children}</article>
      {action}
    </div>
  </li>
);

interface HeadingProps {
  children: ReactNode;
  compact?: boolean;
}

const ReviewListItemHeading = ({ children, compact = false }: HeadingProps) => (
  <div className={cn('flex items-center gap-4', !compact && 'pr-8')}>{children}</div>
);

interface AvatarProps {
  name: string;
}

const ReviewListItemAvatar = ({ name }: AvatarProps) => {
  const fallbackText = name.trim().slice(0, 1) || '?';

  return (
    <div
      aria-hidden
      className="bg-action-gray-light text-text-subtle text-heading-xs flex size-[54px] shrink-0 items-center justify-center rounded-full font-bold"
    >
      {fallbackText}
    </div>
  );
};

interface HeadingTextProps {
  children: ReactNode;
}

const ReviewListItemHeadingText = ({ children }: HeadingTextProps) => (
  <div className="flex flex-col gap-1">{children}</div>
);

interface NameRowProps {
  children: ReactNode;
}

const ReviewListItemNameRow = ({ children }: NameRowProps) => <div className="flex items-end gap-1">{children}</div>;

interface NameProps {
  children: ReactNode;
}

const ReviewListItemName = ({ children }: NameProps) => (
  <p className="text-heading-xs text-text-subtler font-bold">{children}</p>
);

interface PositionBadgeProps {
  position: UserPosition;
  detailPosition?: string;
}

const ReviewListItemPositionBadge = ({ position, detailPosition }: PositionBadgeProps) => (
  <span className="bg-surface-gray-subtle text-body-sm text-text-subtle inline-flex items-center rounded px-1 py-0.5 font-medium">
    {getUserPositionLabel(position, detailPosition)}
  </span>
);

interface MetaProps {
  children: ReactNode;
}

const ReviewListItemMeta = ({ children }: MetaProps) => (
  <p className="text-body-sm text-text-subtler font-medium">{children}</p>
);

/** 본문 3줄 초과 시 "더보기"로 펼치는 후기 텍스트 */
interface ContentProps {
  children: string;
}

const ReviewListItemContent = ({ children }: ContentProps) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) {
      return;
    }
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  return (
    <div className="mt-4">
      <p ref={textRef} className={`text-body-base text-text-basic font-normal ${isExpanded ? '' : 'line-clamp-3'}`}>
        {children}
      </p>
      {isClamped && !isExpanded ? (
        <button
          type="button"
          className="text-body-sm text-text-subtle mt-1 cursor-pointer font-medium"
          onClick={() => setIsExpanded(true)}
        >
          더보기
        </button>
      ) : null}
    </div>
  );
};

const reportDropdownItemClassName =
  'text-body-base text-text-basic h-12 min-w-[160px] justify-between px-4 font-normal';

const handleReportSelect = () => {
  if (!REPORT_FORM_URL) {
    return;
  }

  window.open(REPORT_FORM_URL, '_blank', 'noopener,noreferrer');
};

interface ActionMenuProps {
  reviewerName: string;
}

const ReviewListItemActionMenu = ({ reviewerName }: ActionMenuProps) => (
  <div className="shrink-0 self-start">
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <IconButton
          type="button"
          aria-label={`${reviewerName} 후기 메뉴`}
          icon={<EllipsisVerticalIcon aria-hidden className="size-4" />}
          className="bg-button-tertiary-fill hover:bg-button-tertiary-fill-hover h-8 w-auto rounded px-2.5"
        />
      </Dropdown.Trigger>
      <Dropdown.Content align="end" collisionPadding={16} className="w-auto min-w-[160px] gap-2 p-2">
        <Dropdown.Item className={reportDropdownItemClassName} onSelect={handleReportSelect}>
          신고하기
          <EmergencyIcon aria-hidden className="size-5 shrink-0" />
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  </div>
);

export const ReviewListItem = {
  Root: ReviewListItemRoot,
  Heading: ReviewListItemHeading,
  Avatar: ReviewListItemAvatar,
  HeadingText: ReviewListItemHeadingText,
  NameRow: ReviewListItemNameRow,
  Name: ReviewListItemName,
  PositionBadge: ReviewListItemPositionBadge,
  Meta: ReviewListItemMeta,
  Content: ReviewListItemContent,
  ActionMenu: ReviewListItemActionMenu,
};
