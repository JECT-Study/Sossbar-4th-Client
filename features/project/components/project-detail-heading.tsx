'use client';

import { useCallback, useState } from 'react';

import { useMyProfile } from '@/features/profile';
import { CopyIcon, RoundCheckIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { CopyFeedbackTooltip } from '@/shared/components/copy-feedback-tooltip';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { useCopyLinkFeedback } from '@/shared/hooks/use-copy-link-feedback';
import { cn } from '@/shared/lib/cn';

import type { ProjectStatus } from '../project.types';

import { useConfirmProjectMembers } from '../project.hooks';
import { buildProjectInviteUrl } from '../project.lib';

interface Props {
  projectId: number;
  projectStatus: ProjectStatus;
  isLeader: boolean;
}

export const ProjectDetailHeading = ({ projectId, projectStatus, isLeader }: Props) => {
  const { data: myProfile } = useMyProfile();
  const {
    open: isInviteTooltipOpen,
    message: inviteTooltipMessage,
    close: closeInviteTooltip,
    copyLink,
  } = useCopyLinkFeedback();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const { mutateAsync: confirmTeam, isPending: isConfirming } = useConfirmProjectMembers(projectId);

  const isInProgress = projectStatus === 'IN_PROGRESS';

  const handleCopyInviteLink = () => {
    void copyLink(buildProjectInviteUrl(projectId, myProfile?.username));
  };

  const handleConfirmTeam = useCallback(async () => {
    setConfirmError(null);
    try {
      await confirmTeam();
      setConfirmDialogOpen(false);
    } catch {
      setConfirmError('팀 확정에 실패했습니다. 다시 시도해주세요.');
    }
  }, [confirmTeam]);

  return (
    <header className="border-border-gray-light flex items-end justify-between border-b-[3px] pt-15.5 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-lg text-text-basic font-bold">프로젝트 상세</h1>
        <p className="text-body-base text-text-subtle">프로젝트 정보와 팀원을 확인하고, 필요하면 수정할 수 있어요.</p>
      </div>

      {isLeader && isInProgress ? (
        <div className="flex items-center gap-2">
          <div className="relative inline-flex">
            <Button
              type="button"
              variant="secondary"
              size="medium"
              leftIcon={<CopyIcon aria-hidden className="size-4" />}
              className={cn(
                isInviteTooltipOpen &&
                  'bg-button-secondary-fill-pressed hover:bg-button-secondary-fill-pressed focus:bg-button-secondary-fill-pressed active:bg-button-secondary-fill-pressed',
              )}
              onClick={handleCopyInviteLink}
            >
              초대 링크 복사
            </Button>
            <CopyFeedbackTooltip
              open={isInviteTooltipOpen}
              onClose={closeInviteTooltip}
              message={inviteTooltipMessage}
            />
          </div>
          <Button
            type="button"
            variant="primary"
            size="medium"
            leftIcon={<RoundCheckIcon aria-hidden className="size-4" />}
            disabled={isConfirming}
            onClick={() => setConfirmDialogOpen(true)}
          >
            우리 팀 확정하기
          </Button>

          <ConfirmationDialog
            open={confirmDialogOpen}
            title="팀 확정하기"
            description="확정 후에는 팀원 추가 및 프로젝트 정보 수정이 불가능합니다. 진행하시겠습니까?"
            confirmText="확정하기"
            cancelText="취소"
            onOpenChange={(open) => {
              if (!open) {
                setConfirmError(null);
              }
              setConfirmDialogOpen(open);
            }}
            onConfirm={handleConfirmTeam}
            isConfirming={isConfirming}
            errorMessage={confirmError ?? undefined}
          />
        </div>
      ) : null}
    </header>
  );
};
