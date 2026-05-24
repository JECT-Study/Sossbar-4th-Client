'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { ProfileShareTooltip } from '@/features/profile/components/profile-share-tooltip';
import { ProjectMemberChip } from '@/features/project/components/project-member-chip';
import { ProjectStateBadge } from '@/features/project/components/project-state-badge';
import { buildProjectInviteUrl } from '@/features/project/lib/build-project-invite-url';
import { buildReviewWriteUrl } from '@/features/project/lib/build-review-write-url';
import { CopyIcon, EditIcon, EllipsisVerticalIcon, RoundCheckIcon, TrashIcon } from '@/shared/assets/icons';
import { Alert } from '@/shared/components/alert';
import { Button, IconButton } from '@/shared/components/button';
import { Dropdown } from '@/shared/components/dropdown';
import { cn } from '@/shared/lib/cn';
import { copyTextToClipboard } from '@/shared/lib/copy-text-to-clipboard';
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
}

interface ProjectCardTitleProps {
  host: string;
  projectName: string;
}

interface ProjectCardActionsProps {
  isLeader: boolean;
  projectStatus: ProjectCardItem['projectStatus'];
  projectLink: string;
}

interface ProjectMemberListProps {
  projectId: number;
  members: readonly ProjectCardMember[];
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isLeader = project.myMemberStatus === 'LEADER';

  return (
    <article className="flex flex-row gap-6 p-6">
      <ProjectCardImage projectName={project.projectName} projectImage={project.projectImage} />

      <div className="flex flex-1 flex-col gap-4">
        <ProjectCardHeader
          isLeader={isLeader}
          projectName={project.projectName}
          projectStatus={project.projectStatus}
          startDate={project.startDate}
        />
        <ProjectCardTitle projectName={project.projectName} host={project.host} />
        <ProjectCardActions
          isLeader={isLeader}
          projectStatus={project.projectStatus}
          projectLink={project.projectLink}
        />
        <ProjectMemberList projectId={project.projectId} members={project.members} />
      </div>
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

const ProjectCardHeader = ({ isLeader, projectName, projectStatus, startDate }: ProjectCardHeaderProps) => {
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
            {isLeader ? (
              <Dropdown.Item>
                수정 <EditIcon className="size-5" />
              </Dropdown.Item>
            ) : null}
            <Dropdown.Item>
              삭제
              <TrashIcon className="size-5 stroke-[1.5]" />
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
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

const ProjectCardActions = ({ isLeader, projectStatus, projectLink }: ProjectCardActionsProps) => {
  const [isInviteTooltipOpen, setIsInviteTooltipOpen] = useState(false);
  const [inviteTooltipMessage, setInviteTooltipMessage] = useState('링크가 복사되었습니다');

  const closeInviteTooltip = useCallback(() => setIsInviteTooltipOpen(false), []);

  const handleCopyInviteLink = async () => {
    if (!projectLink.trim()) {
      return;
    }

    const copied = await copyTextToClipboard(buildProjectInviteUrl(projectLink));
    setInviteTooltipMessage(copied ? '링크가 복사되었습니다' : '링크 복사에 실패했습니다');
    setIsInviteTooltipOpen(true);
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
        <ProfileShareTooltip open={isInviteTooltipOpen} onClose={closeInviteTooltip} message={inviteTooltipMessage} />
      </div>
      {projectStatus === 'IN_PROGRESS' ? (
        <Button
          type="button"
          variant="primary"
          size="medium"
          leftIcon={<RoundCheckIcon aria-hidden className="size-4" />}
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
    </div>
  );
};

const ProjectMemberList = ({ projectId, members }: ProjectMemberListProps) => {
  const router = useRouter();

  const handleWriteReview = (member: ProjectCardMember) => {
    router.push(
      buildReviewWriteUrl({
        projectId,
        revieweeId: member.memberId,
        revieweeName: member.name,
      }),
    );
  };

  return (
    <div>
      <p className="text-detail-base text-text-subtle font-normal">팀원 {members.length}명</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {members.map((member) => (
          <li key={member.memberId}>
            {member.reviewStatus === 'writable' ? (
              <ProjectMemberChip
                name={member.name}
                state={member.reviewStatus}
                onWriteReview={() => handleWriteReview(member)}
              />
            ) : (
              <ProjectMemberChip name={member.name} state={member.reviewStatus} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
