'use client';

import { useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { SegmentedControl } from '@/shared/components/segmented-control';
import { cn } from '@/shared/lib/cn';

import type { Review } from '../../types/review';

import { ReviewListItem } from './review-list-item';

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

interface ReviewListCardProps {
  isMyProfile: boolean;
  reviews: Review[];
  showThumbnail: boolean;
}

const reviewToneOptions = [
  { value: 'positive', label: '칭찬해요' },
  { value: 'negative', label: '아쉬워요' },
] as const;

type ReviewTone = (typeof reviewToneOptions)[number]['value'];

export const ReviewListCard = ({ isMyProfile, reviews, showThumbnail }: ReviewListCardProps) => {
  const isEmpty = reviews.length === 0;
  const [selectedTone, setSelectedTone] = useState<ReviewTone>('positive');
  const [isExpanded, setIsExpanded] = useState(false);
  const displayTone = isMyProfile ? selectedTone : 'positive';
  const showItemMenu = isMyProfile && selectedTone === 'negative';
  const visibleReviews = isExpanded ? reviews : reviews.slice(0, INITIAL_VISIBLE_REVIEW_COUNT);
  const showMoreButton = reviews.length > INITIAL_VISIBLE_REVIEW_COUNT && !isExpanded;

  return (
    <section
      className={cn('border-border-gray flex w-full flex-col rounded-2xl border bg-white p-6', isEmpty && 'h-136')}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-heading-base text-text-basic font-bold">받은 후기</h2>
        {isMyProfile && !isEmpty ? (
          <SegmentedControl options={reviewToneOptions} value={selectedTone} onValueChange={setSelectedTone} />
        ) : null}
      </div>

      {isEmpty ? (
        <EmptyState title="아직 도착한 후기가 없어요" />
      ) : (
        <>
          <ul>
            {visibleReviews.map((review) => {
              const feedback = displayTone === 'positive' ? review.positiveFeedback : (review.negativeFeedback ?? '');

              return (
                <ReviewListItem.Root key={review.reviewId}>
                  <ReviewListItem.Heading>
                    {showThumbnail ? (
                      <ReviewListItem.Image src={review.projectImage} alt={`${review.projectName} 썸네일`} />
                    ) : null}
                    <ReviewListItem.HeadingText
                      projectName={review.projectName}
                      meta={`${review.reviewerNickname} · ${review.host} · ${review.createdAt}`}
                    />
                  </ReviewListItem.Heading>
                  <ReviewListItem.Content>{feedback}</ReviewListItem.Content>
                  {showItemMenu ? <ReviewListItem.ActionMenu projectName={review.projectName} /> : null}
                </ReviewListItem.Root>
              );
            })}
          </ul>

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
        </>
      )}
    </section>
  );
};
