import Image from 'next/image';

import { EllipsisVerticalIcon, EmergencyIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/components/button';
import { Dropdown } from '@/shared/components/dropdown';
import { cn } from '@/shared/lib/cn';

import type { Review } from '../types/reviews';

const DEFAULT_IMAGE_PATH = '/default.png';

type ReviewTone = 'positive' | 'negative';

interface ReviewListItemProps {
  review: Review;
  tone: ReviewTone;
  showThumbnail: boolean;
  showActionMenu: boolean;
}

interface ReviewItemActionMenuProps {
  projectName: string;
}

const ReviewItemActionMenu = ({ projectName }: ReviewItemActionMenuProps) => {
  return (
    <div className="absolute top-0 right-0">
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <IconButton
            type="button"
            aria-label={`${projectName} 후기 더보기`}
            icon={<EllipsisVerticalIcon aria-hidden />}
            className="h-6 w-6 bg-transparent p-0"
          />
        </Dropdown.Trigger>
        <Dropdown.Content align="end" sideOffset={-2}>
          <Dropdown.Item>
            신고하기
            <EmergencyIcon aria-hidden className="size-5" />
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
};

export const ReviewListItem = ({ review, tone, showThumbnail, showActionMenu }: ReviewListItemProps) => {
  const feedback = tone === 'positive' ? review.positiveFeedback : (review.negativeFeedback ?? '');

  return (
    <li className="border-border-gray-light border-b py-6">
      <article className="relative">
        <div className={cn('flex gap-6 pr-8', showThumbnail ? 'items-center' : 'items-start')}>
          {showThumbnail ? (
            <Image
              src={review.projectImage ?? DEFAULT_IMAGE_PATH}
              width={72}
              height={54}
              alt={`${review.projectName} 썸네일`}
              className="h-[54px] w-[72px] rounded-lg object-cover"
            />
          ) : null}
          <div>
            <h3 className="text-heading-xs text-text-subtler font-bold">{review.projectName}</h3>
            <p className="text-body-sm text-text-subtler mt-1 font-medium">
              {`${review.reviewerNickname} · ${review.host} · ${review.reviewedAt}`}
            </p>
          </div>
        </div>

        <p className="text-body-base text-text-basic mt-4 font-normal">{feedback}</p>
        {showActionMenu ? <ReviewItemActionMenu projectName={review.projectName} /> : null}
      </article>
    </li>
  );
};
