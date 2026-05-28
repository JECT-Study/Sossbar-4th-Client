'use client';

import { useMemo, useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { SegmentedControl } from '@/shared/components/segmented-control';

import { ReviewListItem } from './review-list-item';
import { useReviews } from '../api/queries';

type ReviewListVariant = 'all' | 'project';

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

type ProjectReviewFilter = {
  projectName: string;
  host: string;
};

interface ReviewListCardProps {
  userId: number;
  variant: ReviewListVariant;
  isMyProfile: boolean;
  projectFilter?: ProjectReviewFilter;
}

const createReviews = (isMyProfile: boolean) => {
  const projects = [
    { projectName: '2025 해커톤 프로젝트', host: '테크 스타트업 컴퍼니', createdAt: '2025.07.10' },
    { projectName: '스타트업 MVP 개발', host: '주최사', createdAt: '2025.04.10' },
    { projectName: '헬스케어 앱 구축 프로젝트', host: '주최사', createdAt: '2024.09.10' },
    { projectName: '2024 해커톤 프로젝트', host: '주최사', createdAt: '2024.03.10' },
    { projectName: '모바일 앱 리디자인', host: '주최사', createdAt: '2024.01.10' },
    { projectName: '브랜드 웹사이트 개편', host: '디자인 스튜디오', createdAt: '2023.12.15' },
    { projectName: '커뮤니티 플랫폼 구축', host: '사이드 프로젝트', createdAt: '2023.10.20' },
    { projectName: 'AI 추천 서비스 PoC', host: '테크랩', createdAt: '2023.08.30' },
    { projectName: '사내 협업툴 개선', host: '주최사', createdAt: '2023.06.18' },
    { projectName: '데이터 대시보드 개발', host: '데이터팀', createdAt: '2023.04.05' },
  ];

  return projects.map((project, index) => ({
    reviewId: index + 1,
    projectImage: null,
    ...project,
    positiveFeedback: '항상 책임감 있게 작업을 수행해주시고 협업 분위기도 좋게 이끌어주셨습니다.',
    ...(isMyProfile
      ? { negativeFeedback: '진행 상황 공유가 조금 더 빨라지면 협업 흐름을 맞추는 데 도움이 될 것 같습니다.' }
      : {}),
    reviewerNickname: '익명의 동료',
  })) satisfies Review[];
};

const reviewToneOptions = [
  { value: 'positive', label: '칭찬해요' },
  { value: 'negative', label: '아쉬워요' },
] as const;

type ReviewTone = (typeof reviewToneOptions)[number]['value'];

export const ReviewListCard = ({ userId, variant, isMyProfile, projectFilter }: ReviewListCardProps) => {
  const [selectedTone, setSelectedTone] = useState<ReviewTone>('positive');
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: reviews = [], isPending, isError } = useReviews(userId);

  const filteredReviews = useMemo(() => {
    if (projectFilter == null) {
      return reviews;
    }
    return reviews.filter(
      (review) => review.projectName === projectFilter.projectName && review.host === projectFilter.host,
    );
  }, [projectFilter, reviews]);

  const displayTone = isMyProfile ? selectedTone : 'positive';
  const showThumbnail = variant === 'all';
  const showItemMenu = isMyProfile && selectedTone === 'negative';
  const visibleReviews = isExpanded ? filteredReviews : filteredReviews.slice(0, INITIAL_VISIBLE_REVIEW_COUNT);
  const showMoreButton = filteredReviews.length > INITIAL_VISIBLE_REVIEW_COUNT && !isExpanded;

  return (
    <section className="border-border-gray flex w-full flex-col rounded-2xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-base text-text-basic font-bold">받은 후기</h2>
        {isMyProfile ? (
          <SegmentedControl options={reviewToneOptions} value={selectedTone} onValueChange={setSelectedTone} />
        ) : null}
      </div>

      {isPending ? (
        <p className="text-body-base text-text-subtle mt-6">받은 후기를 불러오는 중…</p>
      ) : isError ? (
        <p className="text-body-base text-text-error mt-6">받은 후기를 불러오지 못했습니다.</p>
      ) : filteredReviews.length === 0 ? (
        <p className="text-body-base text-text-subtle mt-6">아직 받은 후기가 없습니다.</p>
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
