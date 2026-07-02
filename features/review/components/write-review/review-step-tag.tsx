'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import type { Tag } from '@/features/tag';
import { Button } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

import type { ReviewWriteFormData } from '../../review.types';

import { REVIEW_MAX_TAGS } from '../../review.constants';
import { ReviewTagIdsSchema } from '../../review.schemas';

interface Props {
  tags: Tag[];
  onPrev: () => void;
  onNext: () => void;
}

export const ReviewStepTag = ({ tags, onPrev, onNext }: Props) => {
  const { control, setValue } = useFormContext<ReviewWriteFormData>();
  const selectedTagIds = useWatch({ control, name: 'tagIds' }) ?? [];
  const selectedTagIdSet = new Set(selectedTagIds);
  const canGoNext = ReviewTagIdsSchema.safeParse(selectedTagIds).success;

  const toggleTag = (tagId: number) => {
    const next = selectedTagIdSet.has(tagId)
      ? selectedTagIds.filter((selectedTagId) => selectedTagId !== tagId)
      : [...selectedTagIds, tagId];

    if (next.length > REVIEW_MAX_TAGS) {
      return;
    }

    setValue('tagIds', next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <div className="mt-13 flex w-full max-w-[480px] flex-col">
      <h3 className="text-heading-sm text-text-basic font-bold">태그 선택(최대 {REVIEW_MAX_TAGS}개)</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const selected = selectedTagIdSet.has(tag.tagId);
          const disabled = !selected && selectedTagIds.length >= REVIEW_MAX_TAGS;

          return (
            <button
              key={tag.tagId}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              className={cn(
                'text-body-sm inline-flex h-[33px] max-w-full shrink-0 items-center justify-center rounded-full border px-2.5 font-normal transition-colors outline-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--color-border-primary) focus-visible:ring-offset-1',
                selected
                  ? 'border-border-gray-light bg-button-secondary-fill-hover text-text-basic'
                  : 'border-border-gray-light bg-action-white text-text-basic hover:border-action-secondary-hover hover:bg-action-secondary-hover',
                disabled && 'hover:border-border-gray-light hover:bg-action-gray-light cursor-not-allowed opacity-30',
              )}
              onClick={() => toggleTag(tag.tagId)}
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
