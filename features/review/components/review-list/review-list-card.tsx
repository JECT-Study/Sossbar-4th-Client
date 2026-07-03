'use client';

import { useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';
import { SortDropdown, type SortOrder } from '@/shared/components/sort-dropdown';
import { cn } from '@/shared/lib/cn';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import type { Review } from '../../review.types';

import { ReviewListItem } from './review-list-item';

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

interface ReviewListCardProps {
  reviews: Review[];
  /** 메타 줄에 프로젝트명 노출 여부 (프로젝트 상세에서는 false) */
  showProjectName: boolean;
  /** 정렬 컨트롤 표시 여부 */
  showSort?: boolean;
  /** 프로젝트별 상세 — 후기 신고 메뉴 노출 */
  showReportMenu?: boolean;
}

const buildMetaLine = (review: Review, showProjectName: boolean) =>
  [showProjectName ? review.projectName : null, formatIsoDateToDots(review.createdAt), review.host]
    .filter(Boolean)
    .join(' · ');

export const ReviewListCard = ({
  reviews,
  showProjectName,
  showSort = false,
  showReportMenu = false,
}: ReviewListCardProps) => {
  const [selectedSort, setSelectedSort] = useState<SortOrder>('latest');
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedReviews = showSort
    ? reviews.toSorted((a, b) =>
        selectedSort === 'latest' ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt),
      )
    : reviews;

  const visibleReviews = isExpanded ? sortedReviews : sortedReviews.slice(0, INITIAL_VISIBLE_REVIEW_COUNT);
  const showMoreButton = sortedReviews.length > INITIAL_VISIBLE_REVIEW_COUNT && !isExpanded;

  const headerAction =
    showSort && reviews.length > 0 ? (
      <SortDropdown
        value={selectedSort}
        onValueChange={setSelectedSort}
        ariaLabel="후기 정렬"
        triggerClassName="h-10"
      />
    ) : null;

  return (
    <ProfileStatCard
      title="받은 후기"
      info
      infoLabel="동료들이 남긴 후기 내용이에요"
      headerAction={headerAction}
      className={cn('w-full', reviews.length === 0 && 'min-h-136')}
      bodyClassName="gap-[30px] px-8 py-8"
    >
      {reviews.length === 0 && <EmptyState title="아직 도착한 후기가 없어요" />}

      {reviews.length > 0 && (
        <>
          <ul className="flex w-full flex-col">
            {visibleReviews.map((review) => (
              <ReviewListItem.Root
                key={review.reviewId}
                action={
                  showReportMenu ? <ReviewListItem.ActionMenu reviewerName={review.reviewerNickname} /> : undefined
                }
              >
                <ReviewListItem.Heading compact={showReportMenu}>
                  <ReviewListItem.Avatar name={review.reviewerNickname} imageUrl={review.reviewerImageUrl} />
                  <ReviewListItem.HeadingText>
                    <ReviewListItem.NameRow>
                      <ReviewListItem.Name>{review.reviewerNickname}</ReviewListItem.Name>
                      {review.projectPosition ? (
                        <ReviewListItem.PositionBadge position={review.projectPosition} />
                      ) : null}
                    </ReviewListItem.NameRow>
                    <ReviewListItem.Meta>
                      {showReportMenu ? formatIsoDateToDots(review.createdAt) : buildMetaLine(review, showProjectName)}
                    </ReviewListItem.Meta>
                  </ReviewListItem.HeadingText>
                </ReviewListItem.Heading>
                {review.feedback.trim().length > 0 ? (
                  <ReviewListItem.Content>{review.feedback}</ReviewListItem.Content>
                ) : null}
              </ReviewListItem.Root>
            ))}
          </ul>

          {showMoreButton ? (
            <Button
              type="button"
              variant="tertiary"
              size="large"
              rightIcon={<DownIcon className="size-6" aria-hidden />}
              className="text-body-xl h-[58px] w-full rounded-lg px-7"
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
