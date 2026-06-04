import { DownIcon, UpIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';

interface Props {
  isCollapsed: boolean;
  contentId: string;
  onToggle: () => void;
}

export const TagCollapseButton = ({ isCollapsed, contentId, onToggle }: Props) => (
  <Button
    type="button"
    variant="tertiary"
    aria-controls={contentId}
    aria-expanded={!isCollapsed}
    rightIcon={isCollapsed ? <DownIcon aria-hidden className="size-6" /> : <UpIcon aria-hidden className="size-6" />}
    onClick={onToggle}
    className="mx-auto mt-4 shrink-0"
  >
    {isCollapsed ? '태그 더보기' : '태그 접기'}
  </Button>
);
