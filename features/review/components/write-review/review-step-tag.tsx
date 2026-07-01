'use client';

import type { Tag } from '@/features/tag';
import { Button } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

import { REVIEW_MAX_TAGS } from '../../review.constants';

interface Props {
  tags: Tag[];
  selectedTagIds: Set<number>;
  onToggleTag: (tagId: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ReviewStepTag = ({ tags, selectedTagIds, onToggleTag, onPrev, onNext }: Props) => {
  const canGoNext = selectedTagIds.size > 0;

  return (
    <div className="mt-13 flex w-full max-w-[480px] flex-col">
      <h3 className="text-heading-sm text-text-basic font-bold">태그 선택(최대 {REVIEW_MAX_TAGS}개)</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const selected = selectedTagIds.has(tag.tagId);
          const disabled = !selected && selectedTagIds.size >= REVIEW_MAX_TAGS;

          return (
            <button
              key={tag.tagId}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              className={cn(
                'text-body-sm inline-flex h-[33px] max-w-full shrink-0 items-center justify-center rounded-full border px-2.5 font-normal transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-primary) focus-visible:ring-offset-1',
                selected
                  ? 'border-border-gray-light bg-action-secondary-pressed text-text-basic'
                  : 'border-border-gray-light bg-action-gray-light text-text-basic hover:border-action-secondary-hover hover:bg-action-secondary-hover',
                disabled && 'hover:border-border-gray-light hover:bg-action-gray-light cursor-not-allowed opacity-30',
              )}
              onClick={() => onToggleTag(tag.tagId)}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      <div className="mt-12 flex w-full gap-3">
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          onClick={onPrev}
          className="border-border-gray-light w-full border"
        >
          뒤로가기
        </Button>
        <Button type="button" size="medium" onClick={onNext} disabled={!canGoNext} className="w-full">
          다음
        </Button>
      </div>
    </div>
  );
};
