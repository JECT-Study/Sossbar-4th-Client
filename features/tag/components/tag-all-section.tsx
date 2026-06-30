import { TagBadge } from '@/shared/components/tag-badge';

import type { ReceivedTagCount } from '../tag.types';

interface Props {
  tags: readonly ReceivedTagCount[];
}

export const TagAllSection = ({ tags }: Props) => (
  <section className="flex flex-col gap-4">
    <h3 className="text-heading-xs text-text-subtle pb-2 font-bold">전체 태그</h3>
    <div className="flex flex-wrap gap-x-1 gap-y-2">
      {tags.map((tag) => (
        <TagBadge key={tag.tagId} count={tag.count}>
          {tag.tagName}
        </TagBadge>
      ))}
    </div>
  </section>
);
