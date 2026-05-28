'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useConfirmProjectMembers, useDeleteProject, useDeleteProjectMember } from '@/features/project/api/mutations';
import { EditProjectModal } from '@/features/project/components/edit-project-modal';
import { ProjectMemberChip } from '@/features/project/components/project-member-chip';
import { ProjectStateBadge } from '@/features/project/components/project-state-badge';
import { buildProjectInviteUrl } from '@/features/project/lib/build-project-invite-url';
import { buildReviewWriteUrl } from '@/features/project/lib/build-review-write-url';
import { CopyIcon, EditIcon, EllipsisVerticalIcon, RoundCheckIcon, TrashIcon } from '@/shared/assets/icons';
import { Alert } from '@/shared/components/alert';
import { Button, IconButton } from '@/shared/components/button';
import { CopyFeedbackTooltip } from '@/shared/components/copy-feedback-tooltip';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { Dropdown } from '@/shared/components/dropdown';
import { useCopyLinkFeedback } from '@/shared/hooks/use-copy-link-feedback';
import { cn } from '@/shared/lib/cn';
import { formatIsoDateToDots } from '@/shared/lib/format-date';

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
  onEdit: () => void;
  onDelete: () => void;
}

interface ProjectCardTitleProps {
  host: string;
  projectName: string;
}

interface ProjectCardActionsProps {
  projectId: number;
  isLeader: boolean;
  projectStatus: ProjectCardItem['projectStatus'];
  projectLink: string;
}

interface ProjectMemberListProps {
  projectId: number;
  projectStatus: ProjectCardItem['projectStatus'];
  isLeader: boolean;
  members: readonly ProjectCardMember[];
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isLeader = project.myMemberStatus === 'LEADER';
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { mutateAsync: deleteProject, isPending: isDeleting } = useDeleteProject();

  const handleDeleteProject = useCallback(async () => {
    setDeleteError(null);
    try {
      await deleteProject(project.projectId);
      setDeleteOpen(false);
    } catch {
      setDeleteError('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  }, [deleteProject, project.projectId]);

  return (
    <>
      <article className="flex flex-row gap-6 p-6">
        <ProjectCardImage projectName={project.projectName} projectImage={project.projectImage} />

        <div className="flex flex-1 flex-col gap-4">
          <ProjectCardHeader
            isLeader={isLeader}
            projectName={project.projectName}
            projectStatus={project.projectStatus}
            startDate={project.startDate}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
          <ProjectCardTitle projectName={project.projectName} host={project.host} />
          <ProjectCardActions
            projectId={project.projectId}
            isLeader={isLeader}
            projectStatus={project.projectStatus}
            projectLink={project.projectLink}
          />
          <ProjectMemberList
            projectId={project.projectId}
            projectStatus={project.projectStatus}
            isLeader={isLeader}
            members={project.members}
          />
        </div>
      </article>

      {isLeader ? (
        <>
          <EditProjectModal
            open={editOpen}
            onOpenChange={setEditOpen}
            projectId={project.projectId}
            initialProjectName={project.projectName}
            initialHost={project.host}
          />
          <ConfirmationDialog
            open={deleteOpen}
            title="프로젝트를 삭제할까요?"
            description="삭제하면 프로젝트와 팀원 정보가 모두 제거됩니다. 이 작업은 되돌릴 수 없습니다."
            confirmText="삭제하기"
            cancelText="취소"
            onOpenChange={(open) => {
              if (!open) {
                setDeleteError(null);
              }
              setDeleteOpen(open);
            }}
            onConfirm={handleDeleteProject}
            isConfirming={isDeleting}
            errorMessage={deleteError ?? undefined}
          />
        </>
      ) : null}
    </>
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
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2">
        <ProjectStateBadge variant={projectStatus === 'IN_PROGRESS' ? 'waiting' : 'success'} />
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
              <Dropdown.Item onSelect={onEdit}>
                수정 <EditIcon className="size-5" />
              </Dropdown.Item>
              <Dropdown.Item onSelect={onDelete}>
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

const ProjectCardActions = ({ projectId, isLeader, projectStatus, projectLink }: ProjectCardActionsProps) => {
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
    if (!projectLink.trim()) {
      return;
    }

    await copyLink(buildProjectInviteUrl(projectLink));
  };

  if (!isLeader) {
    return <Alert variant={projectStatus === 'IN_PROGRESS' ? 'warning' : 'success'} className="w-full" />;
  }

  return (
    <div className="flex gap-2">
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
      {projectStatus === 'IN_PROGRESS' ? (
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
        title="우리 팀을 확정할까요?"
        description="확정하면 팀원들과 후기를 주고받을 수 있습니다. 확정 후에는 되돌릴 수 없습니다."
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

const ProjectMemberList = ({ projectId, projectStatus, isLeader, members }: ProjectMemberListProps) => {
  const router = useRouter();
  const [memberToRemove, setMemberToRemove] = useState<ProjectCardMember | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const { mutateAsync: removeMember, isPending: isRemoving } = useDeleteProjectMember(projectId);

  const canRemoveMembers = isLeader && projectStatus === 'IN_PROGRESS';

  const handleWriteReview = (member: ProjectCardMember) => {
    router.push(
      buildReviewWriteUrl({
        projectId,
        revieweeId: member.memberId,
        revieweeName: member.name,
      }),
    );
  };

  const handleRemoveMember = useCallback(async () => {
    if (!memberToRemove) {
      return;
    }
    setRemoveError(null);
    try {
      await removeMember(memberToRemove.memberId);
      setMemberToRemove(null);
    } catch {
      setRemoveError('팀원을 보내지 못했습니다. 다시 시도해주세요.');
    }
  }, [memberToRemove, removeMember]);

  return (
    <div>
      <p className="text-detail-base text-text-subtle font-normal">팀원 {members.length}명</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {members.map((member) => {
          const showRemove = canRemoveMembers && member.reviewStatus !== 'self';
          const handleRemove = () => setMemberToRemove(member);

          return (
            <li key={member.memberId}>
              {member.reviewStatus === 'writable' ? (
                showRemove ? (
                  <ProjectMemberChip
                    name={member.name}
                    state="writable"
                    removable
                    onRemove={handleRemove}
                    onWriteReview={() => handleWriteReview(member)}
                  />
                ) : (
                  <ProjectMemberChip
                    name={member.name}
                    state="writable"
                    onWriteReview={() => handleWriteReview(member)}
                  />
                )
              ) : showRemove ? (
                <ProjectMemberChip name={member.name} state={member.reviewStatus} removable onRemove={handleRemove} />
              ) : (
                <ProjectMemberChip name={member.name} state={member.reviewStatus} />
              )}
            </li>
          );
        })}
      </ul>

      <ConfirmationDialog
        open={memberToRemove != null}
        title={memberToRemove ? `${memberToRemove.name}님을 프로젝트에서 보낼까요?` : ''}
        description="팀원 목록에서 제거되며, 다시 초대 링크로 참여할 수 있습니다."
        confirmText="보내기"
        cancelText="취소"
        onOpenChange={(open) => {
          if (!open) {
            setRemoveError(null);
            setMemberToRemove(null);
          }
        }}
        onConfirm={handleRemoveMember}
        isConfirming={isRemoving}
        errorMessage={removeError ?? undefined}
      />
    </div>
  );
};
