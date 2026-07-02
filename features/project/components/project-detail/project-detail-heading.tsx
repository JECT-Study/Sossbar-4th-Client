'use client';

import { CopyIcon, RoundCheckIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { CopyFeedbackTooltip } from '@/shared/components/copy-feedback-tooltip';
import { useCopyLinkFeedback } from '@/shared/hooks/use-copy-link-feedback';

import type { ProjectStatus } from '../../project.types';

import { buildProjectInviteUrl } from '../../project.lib';

interface Props {
  projectStatus: ProjectStatus;
  isLeader: boolean;
  projectLink: string;
  inviterName?: string;
}

export const ProjectDetailHeading = ({ projectStatus, isLeader, projectLink, inviterName }: Props) => {
  const isInProgress = projectStatus === 'IN_PROGRESS';
  const { open, message, close, copyLink } = useCopyLinkFeedback();

  const handleCopyInviteLink = () => {
    void copyLink(buildProjectInviteUrl(projectLink, inviterName));
  };

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
              onClick={handleCopyInviteLink}
            >
              초대 링크 복사
            </Button>
            <CopyFeedbackTooltip open={open} onClose={close} message={message} />
          </div>
          <Button
            type="button"
            variant="primary"
            size="medium"
            leftIcon={<RoundCheckIcon aria-hidden className="size-4" />}
          >
            우리 팀 확정하기
          </Button>
        </div>
      ) : null}
    </header>
  );
};
