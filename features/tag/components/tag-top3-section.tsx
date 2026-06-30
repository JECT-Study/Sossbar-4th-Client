import { TagBadge } from '@/shared/components/tag-badge';

import type { ReceivedTagCount } from '../tag.types';

interface Props {
  tags: readonly ReceivedTagCount[];
}

export const TagTop3Section = ({ tags }: Props) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-start gap-1 pb-2">
      <h3 className="text-heading-xs text-text-subtle font-bold">이런 리뷰가 많았어요</h3>
      <span aria-hidden className="text-heading-xs leading-none">
        🧐
      </span>
    </div>
    <ol className="flex flex-col items-start gap-2">
      {tags.map((tag, index) => (
        <li key={tag.tagId}>
          <TagBadge count={tag.count} rank={index + 1}>
            {tag.tagName}
          </TagBadge>
        </li>
      ))}
    </ol>
  </section>
);
