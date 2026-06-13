'use client';

import { useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { SegmentedControl } from '@/shared/components/segmented-control';
import { cn } from '@/shared/lib/cn';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { Review } from '../../types/review';

import { ReviewListItem } from './review-list-item';

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

interface ReviewListCardProps {
  isMyProfile: boolean;
  reviews: Review[];
  showThumbnail: boolean;
  showTitle: boolean;
}

const reviewToneOptions = [
  { value: 'positive', label: '칭찬해요' },
  { value: 'negative', label: '아쉬워요' },
] as const;

type ReviewTone = (typeof reviewToneOptions)[number]['value'];

type ViewState = 'empty' | 'restricted' | 'list';

export const ReviewListCard = ({ isMyProfile, reviews, showThumbnail, showTitle }: ReviewListCardProps) => {
  const [selectedTone, setSelectedTone] = useState<ReviewTone>('positive');
  const [isExpanded, setIsExpanded] = useState(false);
  const isNegativeTone = selectedTone === 'negative';
  const filteredReviews = isNegativeTone
    ? reviews.filter((review) => review.negativeFeedback != null && review.negativeFeedback.trim() !== '')
    : reviews;
  const viewState: ViewState =
    reviews.length === 0
      ? 'empty'
      : !isMyProfile && isNegativeTone
        ? 'restricted'
        : filteredReviews.length === 0
          ? 'empty'
          : 'list';
  const visibleReviews = isExpanded ? filteredReviews : filteredReviews.slice(0, INITIAL_VISIBLE_REVIEW_COUNT);
  const showMoreButton = filteredReviews.length > INITIAL_VISIBLE_REVIEW_COUNT && !isExpanded;

  return (
    <section
      className={cn(
        'border-border-gray flex w-full flex-col rounded-2xl border bg-white p-6',
        viewState !== 'list' && 'h-136',
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-heading-base text-text-basic font-bold">받은 후기</h2>
        {reviews.length > 0 ? (
          <SegmentedControl options={reviewToneOptions} value={selectedTone} onValueChange={setSelectedTone} />
        ) : null}
      </div>

      {viewState === 'empty' && <EmptyState title="아직 도착한 후기가 없어요" />}

      {viewState === 'restricted' && <EmptyState title="'아쉬워요' 후기는 본인만 확인 가능해요" />}

      {viewState === 'list' && (
        <>
          <ul>
            {visibleReviews.map((review) => (
              <ReviewListItem.Root key={review.reviewId}>
                <ReviewListItem.Heading>
                  {showThumbnail ? (
                    <ReviewListItem.Image src={review.projectImage} alt={`${review.projectName} 썸네일`} />
                  ) : null}
                  <ReviewListItem.HeadingText>
                    {showTitle ? <ReviewListItem.Title>{review.projectName}</ReviewListItem.Title> : null}
                    <ReviewListItem.Description>
                      {`${review.reviewerNickname} · ${review.host} · ${formatIsoDateToDots(review.createdAt)}`}
                    </ReviewListItem.Description>
                  </ReviewListItem.HeadingText>
                </ReviewListItem.Heading>
                <ReviewListItem.Content>
                  {selectedTone === 'positive' ? review.positiveFeedback : (review.negativeFeedback ?? '')}
                </ReviewListItem.Content>
                {isMyProfile && isNegativeTone ? <ReviewListItem.ActionMenu projectName={review.projectName} /> : null}
              </ReviewListItem.Root>
            ))}
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
