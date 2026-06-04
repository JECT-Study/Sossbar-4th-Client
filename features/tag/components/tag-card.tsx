'use client';

import { EmptyState } from '@/shared/components/empty-state';
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
    <section
      className={cn(
        'border-border-gray flex w-[588px] flex-col overflow-hidden rounded-2xl border bg-white p-6',
        isCollapsed ? 'h-[398px]' : 'h-[652px]',
      )}
    >
      <h2 className="text-heading-base text-text-basic h-6 leading-6 font-bold">받은 태그</h2>

      {!hasTags ? <EmptyState title="받은 태그가 없어요" /> : null}

      {hasTags ? (
        <>
          <TagCollapsibleContent
            contentId={contentId}
            isCollapsed={isCollapsed}
            top3Tags={top3Tags}
            allTags={allTags}
          />
          {collapsible ? <TagCollapseButton isCollapsed={isCollapsed} contentId={contentId} onToggle={toggle} /> : null}
        </>
      ) : null}
    </section>
  );
};
