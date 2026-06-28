'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';
import { cn } from '@/shared/lib/cn';

import { TagCollapseButton } from './tag-collapse-button';
import { TagCollapsibleContent } from './tag-collapsible-content';
import { useReceivedTags } from '../hooks/use-received-tags';
import { useTagCollapsible } from '../hooks/use-tag-collapsible';

const EMPTY_TAGS = [] as const;

interface Props {
  userId: number;
  projectId?: number;
  collapsible?: boolean;
}

export const TagCard = ({ userId, projectId, collapsible }: Props) => {
  const { isCollapsed, contentId, toggle } = useTagCollapsible(Boolean(collapsible));
  const { data: { top3Tags = EMPTY_TAGS, allTags = EMPTY_TAGS } = {} } = useReceivedTags({ userId, projectId });
  const hasTags = top3Tags.length > 0 || allTags.length > 0;

  return (
    <ProfileStatCard
      title="받은 태그"
      info
      infoLabel="동료들이 남긴 후기에서 많이 선택된 태그예요"
      className={cn('w-[585px]', collapsible ? (isCollapsed ? 'h-[462px]' : 'h-[716px]') : 'h-[652px]')}
      bodyClassName="gap-8"
    >
      {!hasTags ? (
        <EmptyState title="받은 태그가 없어요" />
      ) : (
        <>
          <TagCollapsibleContent
            contentId={contentId}
            isCollapsed={isCollapsed}
            top3Tags={top3Tags}
            allTags={allTags}
          />
          {collapsible ? <TagCollapseButton isCollapsed={isCollapsed} contentId={contentId} onToggle={toggle} /> : null}
        </>
      )}
    </ProfileStatCard>
  );
};
