import { TagBadge } from '@/shared/components/tag-badge';

import type { ReceivedTagCount } from '../tag.types';

interface Props {
  tags: readonly ReceivedTagCount[];
}

export const TagAllSection = ({ tags }: Props) => (
  <div>
    <h3 className="text-heading-xs text-text-subtle leading-[150%] font-bold">전체 태그 (많이 받은 순)</h3>
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagBadge key={tag.tagId} count={tag.count}>
          {tag.tagName}
        </TagBadge>
      ))}
    </div>
  </div>
);
