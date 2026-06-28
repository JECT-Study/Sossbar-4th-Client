'use client';

import { useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';
import { SegmentedControl } from '@/shared/components/segmented-control';
import { cn } from '@/shared/lib/cn';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { Review } from '../../types/review';

import { ReviewListItem } from './review-list-item';

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

interface ReviewListCardProps {
  isMyProfile: boolean;
  reviews: Review[];
  /** 메타 줄에 프로젝트명 노출 여부 (프로젝트 상세에서는 false) */
  showProjectName: boolean;
  /** 컨트롤 모드: 프로필은 정렬, 프로젝트 상세는 칭찬/아쉬워요 토글 */
  control?: 'sort' | 'tone';
}

const reviewToneOptions = [
  { value: 'positive', label: '칭찬해요' },
  { value: 'negative', label: '아쉬워요' },
] as const;

const reviewSortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
] as const;

type ReviewTone = (typeof reviewToneOptions)[number]['value'];
type ReviewSort = (typeof reviewSortOptions)[number]['value'];

type ViewState = 'empty' | 'restricted' | 'list';

const buildMetaLine = (review: Review, showProjectName: boolean) =>
  [showProjectName ? review.projectName : null, formatIsoDateToDots(review.createdAt), review.host]
    .filter(Boolean)
    .join(' · ');

const ReviewSortToggle = ({
  value,
  onValueChange,
}: {
  value: ReviewSort;
  onValueChange: (value: ReviewSort) => void;
}) => (
  <div className="flex items-center gap-2">
    {reviewSortOptions.map((option) => (
      <button
        key={option.value}
        type="button"
        className={cn(
          'text-heading-xs cursor-pointer font-medium',
          value === option.value ? 'text-text-subtler' : 'text-text-disabled',
        )}
        aria-pressed={value === option.value}
        onClick={() => onValueChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export const ReviewListCard = ({ isMyProfile, reviews, showProjectName, control = 'tone' }: ReviewListCardProps) => {
  const [selectedTone, setSelectedTone] = useState<ReviewTone>('positive');
  const [selectedSort, setSelectedSort] = useState<ReviewSort>('latest');
  const [isExpanded, setIsExpanded] = useState(false);

  const isSortMode = control === 'sort';
  const isNegativeTone = !isSortMode && selectedTone === 'negative';

  const sortedReviews = isSortMode
    ? reviews.toSorted((a, b) =>
        selectedSort === 'latest' ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt),
      )
    : reviews;

  const filteredReviews = isNegativeTone
    ? sortedReviews.filter((review) => review.negativeFeedback != null && review.negativeFeedback.trim() !== '')
    : sortedReviews;

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

  const headerAction =
    reviews.length === 0 ? null : isSortMode ? (
      <ReviewSortToggle value={selectedSort} onValueChange={setSelectedSort} />
    ) : (
      <SegmentedControl options={reviewToneOptions} value={selectedTone} onValueChange={setSelectedTone} />
    );

  return (
    <ProfileStatCard
      title="받은 후기"
      info
      infoLabel="동료들이 남긴 후기 내용이에요"
      headerAction={headerAction}
      className={cn('w-full', viewState !== 'list' && 'min-h-136')}
      bodyClassName="gap-[30px] px-8 py-8"
    >
      {viewState === 'empty' && <EmptyState title="아직 도착한 후기가 없어요" />}

      {viewState === 'restricted' && <EmptyState title="'아쉬워요' 후기는 본인만 확인 가능해요" />}

      {viewState === 'list' && (
        <>
          <ul className="flex w-full flex-col">
            {visibleReviews.map((review) => {
              const feedback = isNegativeTone ? (review.negativeFeedback ?? '') : review.positiveFeedback;

              return (
                <ReviewListItem.Root key={review.reviewId}>
                  <ReviewListItem.Heading>
                    <ReviewListItem.Avatar name={review.reviewerNickname} />
                    <ReviewListItem.HeadingText>
                      <ReviewListItem.Name>{review.reviewerNickname}</ReviewListItem.Name>
                      <ReviewListItem.Meta>{buildMetaLine(review, showProjectName)}</ReviewListItem.Meta>
                    </ReviewListItem.HeadingText>
                  </ReviewListItem.Heading>
                  {feedback.trim().length > 0 ? <ReviewListItem.Content>{feedback}</ReviewListItem.Content> : null}
                  {isMyProfile && isNegativeTone ? (
                    <ReviewListItem.ActionMenu projectName={review.projectName} />
                  ) : null}
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
              className="mx-auto w-full"
              onClick={() => setIsExpanded(true)}
            >
              후기 더보기
            </Button>
          ) : null}

          <p className="bg-surface-gray-subtler text-detail-sm text-text-subtle rounded-lg p-2 font-normal">
            * 받은 후기는 수정/삭제 불가합니다.
          </p>
        </>
      )}
    </ProfileStatCard>
  );
};
