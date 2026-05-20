'use client';

import Image from 'next/image';
import { useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { SegmentedControl } from '@/shared/components/segmented-control';

const DEFAULT_IMAGE_PATH = '/default.png';

// mock data
const createReviews = () => {
  return Array.from({ length: 5 }, (_, index) => ({
    reviewId: index,
    projectName: `프로젝트 ${index + 1}`,
    host: '주최사',
    positiveFeedback: '항상 책임감 있게 작업을 수행해주시고 협업 분위기도 좋게 이끌어주셨습니다.',
    negativeFeedback: '가끔 진행 상황 공유가 조금 늦어지는 점이 있었습니다.',
    reviewerNickname: '익명의 동료',
  }));
};

const reviewToneOptions = [
  { value: 'positive', label: '칭찬해요' },
  { value: 'negative', label: '아쉬워요' },
] as const;

type ReviewTone = (typeof reviewToneOptions)[number]['value'];

export const ReviewListCard = () => {
  const [selectedTone, setSelectedTone] = useState<ReviewTone>('positive');
  const reviews = createReviews();

  return (
    <section className="border-border-gray flex w-full flex-col rounded-2xl border p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-base text-text-basic font-bold">받은 후기</h2>
        <SegmentedControl options={reviewToneOptions} value={selectedTone} onValueChange={setSelectedTone} />
      </div>

      <ul>
        {reviews.map((review) => (
          <li key={review.reviewId} className="border-border-gray-light border-b py-6">
            <article>
              <div className="flex items-center gap-6">
                <Image
                  src={DEFAULT_IMAGE_PATH}
                  width={72}
                  height={54}
                  alt="프로젝트 썸네일"
                  className="h-[54px] w-[72px] rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-heading-xs text-text-subtler font-bold">{review.projectName}</h3>
                  <p className="text-body-sm text-text-subtler mt-1 font-medium">{`${review.reviewerNickname} · ${review.host}`}</p>
                </div>
              </div>

              <p className="text-body-base text-text-basic mt-4 font-normal">
                {selectedTone === 'positive' ? review.positiveFeedback : review.negativeFeedback}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <Button variant="tertiary" size="large" rightIcon={<DownIcon />} className="mx-auto mt-9">
        후기 더보기
      </Button>

      <p className="text-detail-base text-text-disabled mt-9 font-normal">* 받은 후기는 수정/삭제 불가합니다.</p>
    </section>
  );
};
