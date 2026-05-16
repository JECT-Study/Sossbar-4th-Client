'use client';

import Image from 'next/image';
import { useState } from 'react';

import { DownIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { SegmentedControl } from '@/shared/components/segmented-control';

const reviews = [
  {
    id: 1,
    projectName: '2025 해커톤 프로젝트',
    reviewerLabel: '익명의 동료',
    role: '테크 스타트업 컴퍼니',
    reviewedAt: '2025.07.10',
    content: '코드 리뷰를 꼼꼼하게 해주시고, 팀원들의 성장을 위해 많은 노력을 해주셨습니다.',
  },
  {
    id: 2,
    projectName: '스타트업 MVP 개발',
    reviewerLabel: '익명의 동료',
    role: '주최사',
    reviewedAt: '2025.04.10',
    content: '코드 리뷰를 꼼꼼하게 해주시고, 팀원들의 성장을 위해 많은 노력을 해주셨습니다.',
  },
  {
    id: 3,
    projectName: '헬스케어 앱 구축 프로젝트',
    reviewerLabel: '익명의 동료',
    role: '주최사',
    reviewedAt: '2024.09.10',
    content: '코드 리뷰를 꼼꼼하게 해주시고, 팀원들의 성장을 위해 많은 노력을 해주셨습니다.',
  },
  {
    id: 4,
    projectName: '2024 해커톤 프로젝트',
    reviewerLabel: '익명의 동료',
    role: '주최사',
    reviewedAt: '2024.03.10',
    content: '코드 리뷰를 꼼꼼하게 해주시고, 팀원들의 성장을 위해 많은 노력을 해주셨습니다.',
  },
  {
    id: 5,
    projectName: '모바일 앱 리디자인',
    reviewerLabel: '익명의 동료',
    role: '주최사',
    reviewedAt: '2024.01.10',
    content: '코드 리뷰를 꼼꼼하게 해주시고, 팀원들의 성장을 위해 많은 노력을 해주셨습니다.',
  },
] as const;

const reviewToneOptions = [
  { value: 'praise', label: '칭찬해요' },
  { value: 'improvement', label: '아쉬워요' },
] as const;

export const ReviewListCard = () => {
  const [selectedTone, setSelectedTone] = useState('praise');

  return (
    <section className="border-border-gray flex w-full flex-col rounded-2xl border p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-base text-text-basic font-bold">받은 후기</h2>
        <SegmentedControl options={reviewToneOptions} value={selectedTone} onValueChange={setSelectedTone} />
      </div>

      <ul>
        {reviews.map((review) => (
          <li key={review.id} className="border-border-gray-light border-b py-6">
            <article>
              <div className="flex items-center gap-6">
                <Image
                  src="/default.png"
                  width={72}
                  height={54}
                  alt="프로젝트 썸네일"
                  className="h-[54px] w-[72px] rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-heading-xs text-text-subtler font-bold">{review.projectName}</h3>
                  <p className="text-body-sm text-text-subtler mt-1 font-medium">
                    {review.reviewerLabel} · {review.role} · {review.reviewedAt}
                  </p>
                </div>
              </div>

              <p className="text-body-base text-text-basic mt-4 font-normal">{review.content}</p>
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
