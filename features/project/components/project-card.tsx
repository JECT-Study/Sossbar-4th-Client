'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { EditProjectModal } from '@/features/project/components/edit-project-modal';
import { ProjectMemberChip } from '@/features/project/components/project-member-chip';
import { ProjectStateBadge } from '@/features/project/components/project-state-badge';
import { ProjectStatusAlert } from '@/features/project/components/project-status-alert';
import { CopyIcon, EditIcon, EllipsisVerticalIcon, RoundCheckIcon, TrashIcon } from '@/shared/assets/icons';
import { Button, IconButton } from '@/shared/components/button';
import { CopyFeedbackTooltip } from '@/shared/components/copy-feedback-tooltip';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { Dropdown } from '@/shared/components/dropdown';
import { useCopyLinkFeedback } from '@/shared/hooks/use-copy-link-feedback';
import { ApiError } from '@/shared/lib/api';
import { cn } from '@/shared/lib/cn';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

import { useConfirmProjectMembers, useDeleteProject, useDeleteProjectMember } from '../project.hooks';
import { buildProjectInviteUrl, buildReviewWriteUrl } from '../project.lib';

const DEFAULT_PROJECT_IMAGE = '/default.png';

interface ProjectCardMember {
  memberId: number;
  name: string;
  reviewStatus: 'writable' | 'completed' | 'self';
}

interface ProjectCardItem {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string;
  endDate: string;
  projectLink: string;
  projectImage: string | null;
  projectStatus: 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  myMemberStatus: 'LEADER' | 'MEMBER';
  members: readonly ProjectCardMember[];
}

interface ProjectCardProps {
  project: ProjectCardItem;
}

interface ProjectCardImageProps {
  projectName: string;
  projectImage: string | null;
}

interface ProjectCardHeaderProps {
  isLeader: boolean;
  projectName: string;
  projectStatus: 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  startDate: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface ProjectCardTitleProps {
  host: string;
  projectName: string;
}

interface ProjectCardActionsProps {
  projectId: number;
  isLeader: boolean;
  projectStatus: ProjectCardItem['projectStatus'];
}

interface ProjectMemberListProps {
  projectId: number;
  members: readonly ProjectCardMember[];
  isLeader: boolean;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isLeader = project.myMemberStatus === 'LEADER';
  const [editOpen, setEditOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deleteProjectError, setDeleteProjectError] = useState<string | null>(null);
  const { mutateAsync: deleteProject, isPending: isDeletingProject } = useDeleteProject();

  const handleDeleteProject = useCallback(async () => {
    setDeleteProjectError(null);
    try {
      await deleteProject(project.projectId);
      setDeleteProjectOpen(false);
    } catch {
      setDeleteProjectError('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  }, [deleteProject, project.projectId]);

  return (
    <article className="flex flex-row gap-6 p-6">
      <ProjectCardImage projectName={project.projectName} projectImage={project.projectImage} />

      <div className="flex flex-1 flex-col gap-4">
        <ProjectCardHeader
          isLeader={isLeader}
          projectName={project.projectName}
          projectStatus={project.projectStatus}
          startDate={project.startDate}
          onEdit={isLeader ? () => setEditOpen(true) : undefined}
          onDelete={isLeader ? () => setDeleteProjectOpen(true) : undefined}
        />
        <ProjectCardTitle projectName={project.projectName} host={project.host} />
        <ProjectCardActions projectId={project.projectId} isLeader={isLeader} projectStatus={project.projectStatus} />
        <ProjectMemberList projectId={project.projectId} members={project.members} isLeader={isLeader} />
      </div>

      {isLeader ? (
        <>
          <EditProjectModal
            key={String(editOpen)}
            open={editOpen}
            onOpenChange={setEditOpen}
            projectId={project.projectId}
            defaultProjectName={project.projectName}
            defaultHost={project.host}
          />

          <ConfirmationDialog
            open={deleteProjectOpen}
            title="프로젝트를 삭제할까요?"
            description="삭제하면 복구할 수 없습니다. 팀원과의 후기 기록도 함께 삭제될 수 있습니다."
            confirmText="삭제하기"
            cancelText="취소"
            onOpenChange={(open) => {
              if (!open) {
                setDeleteProjectError(null);
              }
              setDeleteProjectOpen(open);
            }}
            onConfirm={handleDeleteProject}
            isConfirming={isDeletingProject}
            errorMessage={deleteProjectError ?? undefined}
          />
        </>
      ) : null}
    </article>
  );
};

const ProjectCardImage = ({ projectName, projectImage }: ProjectCardImageProps) => {
  return (
    <div className="relative h-[214px] w-[286px] overflow-hidden rounded-2xl">
      <Image
        src={projectImage || DEFAULT_PROJECT_IMAGE}
        alt={`${projectName} 이미지`}
        fill
        sizes="(max-width: 768px) 100vw, 265px"
        className="object-cover"
      />
    </div>
  );
};

const ProjectCardHeader = ({
  isLeader,
  projectName,
  projectStatus,
  startDate,
  onEdit,
  onDelete,
}: ProjectCardHeaderProps) => {
  const isInProgress = projectStatus === 'IN_PROGRESS';

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2">
        <ProjectStateBadge variant={isInProgress ? 'waiting' : 'success'} />
        {isLeader ? <ProjectStateBadge variant="leader" /> : null}
      </div>
      <div className="flex items-center gap-1">
        <time className="text-detail-base text-text-subtle font-normal" dateTime={startDate}>
          {formatIsoDateToDots(startDate)}
        </time>
        {isLeader ? (
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <IconButton
                type="button"
                aria-label={`${projectName} 더보기`}
                icon={<EllipsisVerticalIcon aria-hidden />}
                className="text-icon-gray-light h-8 w-8 bg-transparent"
              />
            </Dropdown.Trigger>
            <Dropdown.Content align="end" sideOffset={0} className="w-44 gap-1">
              {isInProgress ? (
                <Dropdown.Item onSelect={() => onEdit?.()}>
                  수정 <EditIcon className="size-5" />
                </Dropdown.Item>
              ) : null}
              <Dropdown.Item onSelect={() => onDelete?.()}>
                삭제
                <TrashIcon className="size-5 stroke-[1.5]" />
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        ) : null}
      </div>
    </div>
  );
};

const ProjectCardTitle = ({ host, projectName }: ProjectCardTitleProps) => {
  return (
    <div>
      <h2 className="text-heading-sm text-text-subtle font-bold">{projectName}</h2>
      <p className="text-detail-base text-text-subtle mt-1 font-normal">{host}</p>
    </div>
  );
};

const ProjectCardActions = ({ projectId, isLeader, projectStatus }: ProjectCardActionsProps) => {
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

  const handleConfirmTeam = useCallback(async () => {
    setConfirmError(null);
    try {
      await confirmTeam();
      setConfirmDialogOpen(false);
    } catch {
      setConfirmError('팀 확정에 실패했습니다. 다시 시도해주세요.');
    }
  }, [confirmTeam]);

  const handleCopyInviteLink = async () => {
    await copyLink(buildProjectInviteUrl(projectId, myProfile?.username));
  };

  if (!isLeader) {
    return <ProjectStatusAlert variant={projectStatus === 'IN_PROGRESS' ? 'warning' : 'success'} />;
  }

  const isInProgress = projectStatus === 'IN_PROGRESS';

  return (
    <div className="flex gap-2">
      {isInProgress ? (
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
            onClick={() => void handleCopyInviteLink()}
          >
            초대 링크 복사
          </Button>
          <CopyFeedbackTooltip open={isInviteTooltipOpen} onClose={closeInviteTooltip} message={inviteTooltipMessage} />
        </div>
      ) : null}
      {isInProgress ? (
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
      ) : (
        <Button
          type="button"
          variant="primary"
          size="medium"
          disabled
          leftIcon={<RoundCheckIcon aria-hidden className="size-4" />}
          className={cn(
            'bg-button-primary-fill-pressed text-text-basic-inverse',
            'hover:bg-button-primary-fill-pressed hover:text-text-basic-inverse',
            'focus:bg-button-primary-fill-pressed focus:text-text-basic-inverse',
            'active:bg-button-primary-fill-pressed active:text-text-basic-inverse',
          )}
        >
          팀 확정 완료
        </Button>
      )}
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
  );
};

const ProjectMemberList = ({ projectId, members, isLeader }: ProjectMemberListProps) => {
  const router = useRouter();
  const [memberToRemove, setMemberToRemove] = useState<{ memberId: number; name: string } | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const { mutateAsync: removeMember, isPending: isRemovingMember } = useDeleteProjectMember(projectId);

  const handleWriteReview = (member: ProjectCardMember) => {
    router.push(
      buildReviewWriteUrl({
        projectId,
        revieweeId: member.memberId,
        revieweeName: member.name,
      }),
    );
  };

  const handleConfirmRemoveMember = useCallback(async () => {
    if (memberToRemove == null) {
      return;
    }
    setRemoveError(null);
    try {
      await removeMember(memberToRemove.memberId);
      setMemberToRemove(null);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 403 || error.status === 405)) {
        setRemoveError('현재 팀원 제외 기능을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      setRemoveError('팀원 내보내기에 실패했습니다. 다시 시도해주세요.');
    }
  }, [memberToRemove, removeMember]);

  return (
    <div>
      <p className="text-detail-base text-text-subtle font-normal">팀원 {members.length}명</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {members.map((member) => {
          const canRemove = isLeader && member.reviewStatus !== 'self';
          const removeProps = canRemove
            ? ({
                removable: true as const,
                onRemove: () => setMemberToRemove({ memberId: member.memberId, name: member.name }),
              } as const)
            : {};

          if (member.reviewStatus === 'writable') {
            return (
              <li key={member.memberId}>
                <ProjectMemberChip
                  name={member.name}
                  state="writable"
                  onWriteReview={() => handleWriteReview(member)}
                  {...removeProps}
                />
              </li>
            );
          }

          return (
            <li key={member.memberId}>
              <ProjectMemberChip name={member.name} state={member.reviewStatus} {...removeProps} />
            </li>
          );
        })}
      </ul>

      <ConfirmationDialog
        open={memberToRemove != null}
        title="팀원 내보내기"
        description="팀원을 팀 목록에서 삭제할까요? 삭제된 팀원은 되돌릴 수 없습니다."
        confirmText="내보내기"
        cancelText="취소"
        onOpenChange={(open) => {
          if (!open) {
            setRemoveError(null);
            setMemberToRemove(null);
          }
        }}
        onConfirm={handleConfirmRemoveMember}
        isConfirming={isRemovingMember}
        errorMessage={removeError ?? undefined}
      />
    </div>
  );
};
