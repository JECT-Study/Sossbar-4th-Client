'use client';

import { useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { SegmentedControl } from '@/shared/components/segmented-control';

import { ReviewListItem } from './review-list-item';
import { useReviews } from '../api/queries';

type ReviewListVariant = 'all' | 'project';

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

interface ReviewListCardProps {
  userId: number;
  variant: ReviewListVariant;
  isMyProfile: boolean;
}

const reviewToneOptions = [
  { value: 'positive', label: '칭찬해요' },
  { value: 'negative', label: '아쉬워요' },
] as const;

type ReviewTone = (typeof reviewToneOptions)[number]['value'];

export const ReviewListCard = ({ userId, variant, isMyProfile }: ReviewListCardProps) => {
  const [selectedTone, setSelectedTone] = useState<ReviewTone>('positive');
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: reviews = [], isPending } = useReviews(userId);

  const displayTone = isMyProfile ? selectedTone : 'positive';
  const showThumbnail = variant === 'all';
  const showItemMenu = isMyProfile && selectedTone === 'negative';
  const visibleReviews = isExpanded ? reviews : reviews.slice(0, INITIAL_VISIBLE_REVIEW_COUNT);
  const showMoreButton = reviews.length > INITIAL_VISIBLE_REVIEW_COUNT && !isExpanded;

  return (
    <section className="border-border-gray flex w-full flex-col rounded-2xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-base text-text-basic font-bold">받은 후기</h2>
        {isMyProfile ? (
          <SegmentedControl options={reviewToneOptions} value={selectedTone} onValueChange={setSelectedTone} />
        ) : null}
      </div>

      {isPending ? (
        <p className="text-body-sm text-text-subtle mt-6">후기를 불러오는 중...</p>
      ) : reviews.length === 0 ? (
        <p className="text-body-sm text-text-subtle mt-6">아직 받은 후기가 없습니다.</p>
      ) : (
        <ul>
          {visibleReviews.map((review) => (
            <ReviewListItem
              key={review.reviewId}
              review={review}
              tone={displayTone}
              showThumbnail={showThumbnail}
              showActionMenu={showItemMenu}
            />
          ))}
        </ul>
      )}

      {showMoreButton ? (
        <Button
          type="button"
          variant="tertiary"
          size="large"
          rightIcon={<DownIcon className="size-6" aria-hidden />}
          className="mx-auto mt-9"
          onClick={() => setIsExpanded(true)}
        >
          후기 더보기
        </Button>
      ) : null}

      <p className="text-detail-base text-text-disabled mt-9 font-normal">* 받은 후기는 수정/삭제 불가합니다.</p>
    </section>
  );
};
