'use client';

import { useId, useState } from 'react';

import { DownIcon, UpIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { TagBadge } from '@/shared/components/tag-badge';
import { cn } from '@/shared/lib/cn';

const topTags = [
  { rank: 1, label: '응답이 빨라요', count: 99, priority: 'first' },
  { rank: 2, label: '적극적이에요', count: 98, priority: 'second' },
  { rank: 3, label: '아이디어가 많아요', count: 97, priority: 'third' },
] as const;

const receivedTags = [
  '약속을 잘 지켜요',
  '꼼꼼해요',
  '피드백을 잘 수용해요',
  '문서 정리를 잘 해요',
  '마감을 잘 지켜요',
  '팀 분위기를 좋게 만들어요',
  '시간 조율을 잘해요',
  '실행력이 좋아요',
  '작업 속도가 빨라요',
  '팀원들을 잘 도와줘요',
  '센스가 좋아요',
  '문제 해결을 잘 해요',
  '일정 관리를 잘 해요',
  '끈기있어요',
  '고마움을 잘 표현해요',
  '먼저 친근하게 다가와요',
  '모르는 것을 숨기지 않고 물어봐요',
] as const;

export const TagCard = ({ collapsible }: { collapsible?: boolean }) => {
  const [isCollapsed, setIsCollapsed] = useState(Boolean(collapsible));
  const contentId = useId();
  const isContentCollapsed = Boolean(collapsible) && isCollapsed;

  return (
    <section
      className={cn(
        'border-border-gray flex w-[588px] flex-col overflow-hidden rounded-2xl border bg-white p-6',
        isContentCollapsed ? 'h-[398px]' : 'h-[652px]',
      )}
    >
      <div id={contentId} className="relative min-h-0 flex-1 overflow-hidden">
        <div className="flex w-full flex-col gap-6">
          <h2 className="text-heading-base text-text-basic h-6 leading-6 font-bold">받은 태그</h2>

          <div>
            <h3 className="text-heading-xs text-text-subtle leading-[150%] font-bold">동료가 뽑은 TOP3</h3>
            <div className="mt-4 flex flex-col items-start gap-2">
              {topTags.map((tag) => (
                <TagBadge key={tag.rank} count={tag.count} priority={tag.priority}>
                  {tag.label}
                </TagBadge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-heading-xs text-text-subtle leading-[150%] font-bold">전체 태그 (많이 받은 순)</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {receivedTags.map((tag) => (
                <TagBadge key={tag} count={96}>
                  {tag}
                </TagBadge>
              ))}
            </div>
          </div>
        </div>

        {isContentCollapsed ? (
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
    </section>
  );
};
