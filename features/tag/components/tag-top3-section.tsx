import { TagBadge } from '@/shared/components/tag-badge';

import type { ReceivedTagCount } from '../tag.types';

interface Props {
  tags: readonly ReceivedTagCount[];
}

export const TagTop3Section = ({ tags }: Props) => (
  <ol className="flex flex-col items-start gap-2.5">
    {tags.map((tag, index) => (
      <li key={tag.tagId}>
        <TagBadge count={tag.count} rank={index + 1}>
          {tag.tagName}
        </TagBadge>
      </li>
    ))}
  </ol>
);
