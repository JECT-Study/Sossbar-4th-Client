'use client';

import { useId, useState } from 'react';

import { DownIcon, UpIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { TagBadge } from '@/shared/components/tag-badge';
import { cn } from '@/shared/lib/cn';

import type { ReceivedTagCount } from '../tag.types';

interface Props {
  tags: readonly ReceivedTagCount[];
}

export const TagAllSection = ({ tags }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const hasTags = tags.length > 0;

  const handleToggle = () => setIsExpanded((prev) => !prev);

  return (
    <section className="flex flex-col gap-4">
      <div id={contentId} className={cn('flex-col gap-4', hasTags && !isExpanded ? 'hidden' : 'flex', 'xl:flex')}>
        <h3 className="text-heading-xs text-text-subtle pb-2 font-bold">전체 태그</h3>
        <div className="flex flex-wrap gap-x-1 gap-y-2">
          {tags.map((tag) => (
            <TagBadge key={tag.tagId} count={tag.count}>
              {tag.tagName}
            </TagBadge>
          ))}
        </div>
      </div>
      {hasTags ? (
        <Button
          type="button"
          variant="tertiary"
          className="border-border-gray h-[52px] w-full justify-center rounded-lg border xl:hidden"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={handleToggle}
          rightIcon={
            isExpanded ? (
              <UpIcon className="size-4 shrink-0" aria-hidden />
            ) : (
              <DownIcon className="size-4 shrink-0" aria-hidden />
            )
          }
        >
          {isExpanded ? '태그 접기' : '태그 전체보기'}
        </Button>
      ) : null}
    </section>
  );
};
