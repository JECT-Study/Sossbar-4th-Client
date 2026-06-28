'use client';

import type { ReactNode } from 'react';

import { useLayoutEffect, useRef, useState } from 'react';

import { EllipsisVerticalIcon, EmergencyIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/components/button';
import { Dropdown } from '@/shared/components/dropdown';

interface RootProps {
  children: ReactNode;
}

const ReviewListItemRoot = ({ children }: RootProps) => (
  <li className="border-border-gray-light border-b py-6 first:pt-0 last:border-b-0">
    <article className="relative">{children}</article>
  </li>
);

interface HeadingProps {
  children: ReactNode;
}

const ReviewListItemHeading = ({ children }: HeadingProps) => (
  <div className="flex items-center gap-4 pr-8">{children}</div>
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

interface NameProps {
  children: ReactNode;
}

const ReviewListItemName = ({ children }: NameProps) => (
  <p className="text-heading-xs text-text-subtler font-bold">{children}</p>
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

interface ActionMenuProps {
  projectName: string;
}

const ReviewListItemActionMenu = ({ projectName }: ActionMenuProps) => (
  <div className="absolute top-0 right-0">
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <IconButton
          type="button"
          aria-label={`${projectName} 후기 더보기`}
          icon={<EllipsisVerticalIcon aria-hidden />}
          className="h-6 w-6 bg-transparent p-0"
        />
      </Dropdown.Trigger>
      <Dropdown.Content align="end" sideOffset={-2}>
        <Dropdown.Item>
          신고하기
          <EmergencyIcon aria-hidden className="size-5" />
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
  Name: ReviewListItemName,
  Meta: ReviewListItemMeta,
  Content: ReviewListItemContent,
  ActionMenu: ReviewListItemActionMenu,
};
