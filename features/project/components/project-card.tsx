'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

import { useDeleteProject } from '@/features/project/api/mutations';
import { EditProjectModal } from '@/features/project/components/edit-project-modal';
import { ProjectMemberReviewStatusChip } from '@/features/project/components/project-member-review-status-chip';
import { ProjectStateBadge } from '@/features/project/components/project-state-badge';
import { EditIcon, EllipsisVerticalIcon, TrashIcon } from '@/shared/assets/icons';
import { IconButton } from '@/shared/components/button';
import { ConfirmationDialog } from '@/shared/components/dialog/confirmation-dialog';
import { Dropdown } from '@/shared/components/dropdown';
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
  onEdit?: () => void;
  onDelete?: () => void;
}

interface ProjectCardTitleProps {
  host: string;
  projectName: string;
  startDate: string;
  endDate: string;
}

interface ProjectReviewInfoBoxProps {
  written: number;
  total: number;
}

interface ProjectMemberListProps {
  members: readonly ProjectCardMember[];
  written: number;
  total: number;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isLeader = project.myMemberStatus === 'LEADER';
  const [editOpen, setEditOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deleteProjectError, setDeleteProjectError] = useState<string | null>(null);
  const { mutateAsync: deleteProject, isPending: isDeletingProject } = useDeleteProject();

  const reviewableMembers = project.members.filter((member) => member.reviewStatus !== 'self');
  const writtenReviewCount = reviewableMembers.filter((member) => member.reviewStatus === 'completed').length;
  const totalReviewCount = reviewableMembers.length;

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
    <article className="border-border-gray-light flex flex-row gap-6 rounded-2xl border p-6">
      <ProjectCardImage projectName={project.projectName} projectImage={project.projectImage} />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <ProjectCardHeader
          isLeader={isLeader}
          projectName={project.projectName}
          projectStatus={project.projectStatus}
          startDate={project.startDate}
          onEdit={isLeader ? () => setEditOpen(true) : undefined}
          onDelete={isLeader ? () => setDeleteProjectOpen(true) : undefined}
        />
        <ProjectCardTitle
          projectName={project.projectName}
          host={project.host}
          startDate={project.startDate}
          endDate={project.endDate}
        />
        <ProjectReviewInfoBox written={writtenReviewCount} total={totalReviewCount} />
        {totalReviewCount > 0 ? (
          <ProjectMemberList members={project.members} written={writtenReviewCount} total={totalReviewCount} />
        ) : null}
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
    <div className="relative h-[214px] w-[286px] shrink-0 overflow-hidden rounded-2xl">
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
            {isLeader && isInProgress ? (
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
      </div>
    </div>
  );
};

const ProjectCardTitle = ({ host, projectName, startDate, endDate }: ProjectCardTitleProps) => {
  const hasDateRange = Boolean(startDate && endDate);

  return (
    <div>
      <h2 className="text-heading-sm text-text-subtle font-bold">{projectName}</h2>
      <div className="mt-1 flex items-center gap-1 whitespace-nowrap">
        {hasDateRange ? (
          <>
            <span className="text-detail-base text-text-subtle font-normal">
              {formatIsoDateToDots(startDate)} - {formatIsoDateToDots(endDate)}
            </span>
            <span className="text-detail-sm text-text-subtler font-medium">・</span>
          </>
        ) : null}
        <span className="text-detail-base text-text-subtle font-normal">{host}</span>
      </div>
    </div>
  );
};

const ProjectReviewInfoBox = ({ written, total }: ProjectReviewInfoBoxProps) => {
  const message =
    total > 0 && written === total
      ? '모든 후기 작성이 완료되었습니다! 받은 후기를 확인해보세요.'
      : '모든 팀원이 후기 작성을 완료해야 받은 후기를 확인할 수 있습니다.';

  return (
    <div className="bg-surface-gray-subtler flex items-center rounded-lg p-2">
      <p className="text-detail-sm text-text-subtle flex-1 font-normal">{message}</p>
    </div>
  );
};

const ProjectMemberList = ({ members, written, total }: ProjectMemberListProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-body-base text-text-subtle flex gap-1 font-normal">
        <span>후기 작성</span>
        <span>
          {written}/{total}
        </span>
      </p>

      <ul className="flex max-w-full gap-2 overflow-x-auto">
        {members.map((member) => (
          <li key={member.memberId} className="shrink-0">
            <ProjectMemberReviewStatusChip name={member.name} state={member.reviewStatus} />
          </li>
        ))}
      </ul>
    </div>
  );
};
