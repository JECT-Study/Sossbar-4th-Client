import { EditIcon, ShareIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { CopyFeedbackTooltip } from '@/shared/components/copy-feedback-tooltip';
import { cn } from '@/shared/lib/cn';

interface Props {
  isShareTooltipOpen: boolean;
  shareTooltipMessage: string;
  onCloseShareTooltip: () => void;
  onEditProfile: () => void;
  onShareProfile: () => void;
}

export const ProfileOwnerActions = ({
  isShareTooltipOpen,
  shareTooltipMessage,
  onCloseShareTooltip,
  onEditProfile,
  onShareProfile,
}: Props) => (
  <div className="ml-auto flex shrink-0 items-start gap-2">
    <Button variant="secondary" size="small" leftIcon={<EditIcon className="size-4" />} onClick={onEditProfile}>
      프로필 수정
    </Button>
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
