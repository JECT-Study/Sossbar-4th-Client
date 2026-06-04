import { TagBadge } from '@/shared/components/tag-badge';

import type { ReceivedTagCount } from '../tag.types';

const topTagPriorities = ['first', 'second', 'third'] as const;

interface Props {
  tags: readonly ReceivedTagCount[];
}

export const TagTop3Section = ({ tags }: Props) => (
  <div>
    <h3 className="text-heading-xs text-text-subtle leading-[150%] font-bold">동료가 뽑은 TOP3</h3>
    <div className="mt-4 flex flex-col items-start gap-2">
      {tags.map((tag, index) => (
        <TagBadge key={tag.tagId} count={tag.count} priority={topTagPriorities[index]}>
          {tag.tagName}
        </TagBadge>
      ))}
    </div>
  </div>
);
