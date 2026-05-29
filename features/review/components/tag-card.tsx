'use client';

import { useId, useState } from 'react';

import { DownIcon, UpIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { TagBadge } from '@/shared/components/tag-badge';
import { cn } from '@/shared/lib/cn';

import { useReceivedTags } from '../api/queries';

const EMPTY_TAGS = [] as const;
const topTagPriorities = ['first', 'second', 'third'] as const;

type TagCardProps = {
  userId: number;
  projectId?: number;
  collapsible?: boolean;
};

export const TagCard = ({ userId, projectId, collapsible }: TagCardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(Boolean(collapsible));
  const contentId = useId();
  const {
    data: { top3Tags = EMPTY_TAGS, allTags = EMPTY_TAGS } = {},
    isPending,
    isError,
  } = useReceivedTags({ userId, projectId });
  const hasTags = top3Tags.length > 0 || allTags.length > 0;

  return (
    <section
      className={cn(
        'border-border-gray flex w-[588px] flex-col overflow-hidden rounded-2xl border bg-white p-6',
        isCollapsed ? 'h-[398px]' : 'h-[652px]',
      )}
    >
      <h2 className="text-heading-base text-text-basic h-6 leading-6 font-bold">받은 태그</h2>

      {isPending ? <p className="text-body-sm text-text-subtle mt-6">태그 정보를 불러오는 중...</p> : null}

      {isError ? <p className="text-body-sm text-text-error mt-6">태그 정보를 불러오지 못했습니다.</p> : null}

      {!isPending && !isError && !hasTags ? <EmptyState title="받은 태그가 없어요" /> : null}

      {!isPending && !isError && hasTags ? (
        <>
          <div id={contentId} className="relative mt-6 min-h-0 flex-1 overflow-hidden">
            <div className="flex w-full flex-col gap-6">
              <div>
                <h3 className="text-heading-xs text-text-subtle leading-[150%] font-bold">동료가 뽑은 TOP3</h3>
                <div className="mt-4 flex flex-col items-start gap-2">
                  {top3Tags.map((tag, index) => (
                    <TagBadge key={tag.tagId} count={tag.count} priority={topTagPriorities[index]}>
                      {tag.tagName}
                    </TagBadge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-heading-xs text-text-subtle leading-[150%] font-bold">전체 태그 (많이 받은 순)</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <TagBadge key={tag.tagId} count={tag.count}>
                      {tag.tagName}
                    </TagBadge>
                  ))}
                </div>
              </div>
            </div>

            {isCollapsed ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-white/0 to-white"
              />
            ) : null}
          </div>

          {collapsible ? (
            <Button
              type="button"
              variant="tertiary"
              aria-controls={contentId}
              aria-expanded={!isCollapsed}
              rightIcon={
                isCollapsed ? <DownIcon aria-hidden className="size-6" /> : <UpIcon aria-hidden className="size-6" />
              }
              onClick={() => setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed)}
              className="mx-auto mt-4 shrink-0"
            >
              {isCollapsed ? '태그 더보기' : '태그 접기'}
            </Button>
          ) : null}
        </>
      ) : null}
    </section>
  );
};
