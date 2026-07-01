'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';

import { TagAllSection } from './tag-all-section';
import { TagTop3Section } from './tag-top3-section';
import { useReceivedTags } from '../tag.hooks';

const EMPTY_TAGS = [] as const;

interface Props {
  userLink: string;
  projectId?: number;
}

export const TagCard = ({ userLink, projectId }: Props) => {
  const { data: { top3Tags = EMPTY_TAGS, allTags = EMPTY_TAGS } = {} } = useReceivedTags({ userLink, projectId });
  const hasTags = top3Tags.length > 0 || allTags.length > 0;

  return (
    <ProfileStatCard
      title="받은 태그"
      info
      infoLabel="동료들이 남긴 후기에서 많이 선택된 태그예요"
      className="h-[652px] w-[585px]"
      bodyClassName="gap-8"
    >
      {!hasTags ? (
        <EmptyState title="받은 태그가 없어요" />
      ) : (
        <>
          <TagTop3Section tags={top3Tags} />
          <TagAllSection tags={allTags} />
        </>
      )}
    </ProfileStatCard>
  );
};
