import { ShareIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { CopyFeedbackTooltip } from '@/shared/components/copy-feedback-tooltip';
import { cn } from '@/shared/lib/cn';

interface Props {
  isShareTooltipOpen: boolean;
  shareTooltipMessage: string;
  onCloseShareTooltip: () => void;
  onShareProfile: () => void;
}

export const ProfileShareActions = ({
  isShareTooltipOpen,
  shareTooltipMessage,
  onCloseShareTooltip,
  onShareProfile,
}: Props) => (
  <div className="ml-auto flex shrink-0 items-start gap-2">
    <div className="relative inline-flex">
      <Button
        type="button"
        variant="primary"
        size="medium"
        leftIcon={<ShareIcon aria-hidden />}
        className={cn(
          'h-11',
          isShareTooltipOpen &&
            'bg-button-primary-fill-pressed hover:bg-button-primary-fill-pressed focus:bg-button-primary-fill-pressed active:bg-button-primary-fill-pressed',
        )}
        onClick={onShareProfile}
      >
        내 프로필 공유하기
      </Button>
      <CopyFeedbackTooltip open={isShareTooltipOpen} onClose={onCloseShareTooltip} message={shareTooltipMessage} />
    </div>
  </div>
);
