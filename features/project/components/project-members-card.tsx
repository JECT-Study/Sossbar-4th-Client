'use client';

import { Button } from '@/shared/components/button';
import { SectionCard } from '@/shared/components/section-card';

import type { ProjectMemberResponse, ProjectStatus } from '../project.types';

import { useProjectMembersEdit } from '../project.hooks';
import { ProjectMembersEdit } from './project-members-edit';
import { ProjectMembersView } from './project-members-view';

interface Props {
  projectId: number;
  members: ProjectMemberResponse[];
  projectStatus: ProjectStatus;
  isLeader: boolean;
  myUserId: number;
}

export const ProjectMembersCard = ({ projectId, members, projectStatus, isLeader, myUserId }: Props) => {
  const { isEditing, startEditing, cancelEditing, pendingRemovalIds, toggleRemoval, isSaving, submit } =
    useProjectMembersEdit({ projectId });

  const action = !isLeader ? null : isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="tertiary" onClick={cancelEditing} disabled={isSaving} className="text-text-basic">
        취소
      </Button>
      <Button
        type="button"
        variant="tertiary"
        onClick={() => void submit()}
        disabled={isSaving}
        className="border-border-gray-dark text-text-basic border"
      >
        저장
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="tertiary"
      onClick={startEditing}
      className="border-border-gray-dark text-text-subtle w-17 border"
    >
      수정
    </Button>
  );

  return (
    <SectionCard title="팀원 정보" action={action}>
      {isEditing ? (
        <ProjectMembersEdit
          members={members}
          myUserId={myUserId}
          pendingRemovalIds={pendingRemovalIds}
          onToggleRemoval={toggleRemoval}
        />
      ) : (
        <ProjectMembersView projectId={projectId} members={members} myUserId={myUserId} projectStatus={projectStatus} />
      )}
    </SectionCard>
  );
};
