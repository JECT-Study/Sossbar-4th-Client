import type { ReceivedTagCount } from '../tag.types';

import { TagAllSection } from './tag-all-section';
import { TagTop3Section } from './tag-top3-section';

interface Props {
  contentId: string;
  isCollapsed: boolean;
  top3Tags: readonly ReceivedTagCount[];
  allTags: readonly ReceivedTagCount[];
}

export const TagCollapsibleContent = ({ contentId, isCollapsed, top3Tags, allTags }: Props) => (
  <div id={contentId} className="relative mt-6 min-h-0 flex-1 overflow-hidden">
    <div className="flex w-full flex-col gap-6">
      <TagTop3Section tags={top3Tags} />
      <TagAllSection tags={allTags} />
    </div>

    {isCollapsed ? (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-b from-white/0 to-white"
      />
    ) : null}
  </div>
);
