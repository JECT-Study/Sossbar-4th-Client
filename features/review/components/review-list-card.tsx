'use client';

import { useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { SegmentedControl } from '@/shared/components/segmented-control';

import type { Review } from '../types/review';

import { ReviewListItem } from './review-list-item';

type ReviewListVariant = 'all' | 'project';

const INITIAL_VISIBLE_REVIEW_COUNT = 5;

interface ReviewListCardProps {
  variant: ReviewListVariant;
  isMyProfile: boolean;
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

export const ReviewListCard = ({ variant, isMyProfile }: ReviewListCardProps) => {
  const [selectedTone, setSelectedTone] = useState<ReviewTone>('positive');
  const [isExpanded, setIsExpanded] = useState(false);
  const reviews = createReviews(isMyProfile);
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
    </section>
  );
};
