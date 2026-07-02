'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/shared/components/button';
import { SectionCard, SectionInfoRow } from '@/shared/components/section-card';

import type { ProjectMemberResponse, ProjectMemberReviewStatus, ProjectStatus } from '../../project.types';

import { useDeleteProjectMember } from '../../project.hooks';
import { buildReviewWriteUrl } from '../../project.lib';
import { ProjectMemberChip } from '../project-member-chip';

interface Props {
  projectId: number;
  members: ProjectMemberResponse[];
  projectStatus: ProjectStatus;
  isLeader: boolean;
  myUserId: number;
}

export const ProjectMembersCard = ({ projectId, members, projectStatus, isLeader, myUserId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  // 팀 확정(IN_PROGRESS 종료) 이후에는 팀원을 수정할 수 없으므로 수정 버튼을 숨긴다.
  const isEditable = isLeader && projectStatus === 'IN_PROGRESS';

  const action = !isEditable ? null : isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="tertiary" onClick={() => setIsEditing(false)} className="text-text-basic">
        취소
      </Button>
      <Button
        type="button"
        variant="tertiary"
        onClick={() => setIsEditing(false)}
        className="border-border-gray-dark text-text-basic border"
      >
        저장
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      variant="tertiary"
      onClick={() => setIsEditing(true)}
      className="border-border-gray-dark text-text-subtle border"
    >
      수정
    </Button>
  );

  return (
    <SectionCard title="팀원 정보" action={action}>
      {isEditing ? (
        <ProjectMembersEditFields projectId={projectId} members={members} myUserId={myUserId} />
      ) : (
        <ProjectMembersViewFields
          projectId={projectId}
          members={members}
          myUserId={myUserId}
          projectStatus={projectStatus}
        />
      )}
    </SectionCard>
  );
};

interface ViewFieldsProps {
  projectId: number;
  members: ProjectMemberResponse[];
  myUserId: number;
  projectStatus: ProjectStatus;
}

const ProjectMembersViewFields = ({ projectId, members, myUserId, projectStatus }: ViewFieldsProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <SectionInfoRow label="참여한 팀원" align="start">
        <ul className="flex flex-wrap gap-2">
          {members.map((member) => {
            const reviewStatus: ProjectMemberReviewStatus =
              member.userId === myUserId ? 'self' : member.reviewWritten === true ? 'completed' : 'writable';

            if (reviewStatus === 'writable') {
              return (
                <li key={member.userId}>
                  <ProjectMemberChip
                    name={member.username}
                    profileImageUrl={member.profileImageUrl}
                    state="writable"
                    onWriteReview={() =>
                      router.push(
                        buildReviewWriteUrl({
                          projectId,
                          revieweeId: member.userId,
                          revieweeName: member.username,
                        }),
                      )
                    }
                  />
                </li>
              );
            }
            return (
              <li key={member.userId}>
                <ProjectMemberChip
                  name={member.username}
                  profileImageUrl={member.profileImageUrl}
                  state={reviewStatus}
                />
              </li>
            );
          })}
        </ul>
      </SectionInfoRow>

      {projectStatus === 'IN_PROGRESS' ? (
        <p className="bg-surface-gray-subtle text-text-subtle text-body-sm rounded-lg px-4 py-3">
          * 팀원이 모두 참여했다면 확정을 눌러주세요
        </p>
      ) : null}
    </div>
  );
};

interface EditFieldsProps {
  projectId: number;
  members: ProjectMemberResponse[];
  myUserId: number;
}

const ProjectMembersEditFields = ({ projectId, members, myUserId }: EditFieldsProps) => {
  const { mutate: deleteMember, isPending } = useDeleteProjectMember(projectId);

  return (
    <SectionInfoRow label="참여한 팀원" align="start">
      <ul className="flex flex-wrap gap-2">
        {members.map((member) => {
          // 편집 모드에서는 후기 작성/작성 완료 버튼을 노출하지 않는다. 본인은 일반 태그, 나머지 팀원은 삭제 가능한 태그로 표시한다.
          if (member.userId === myUserId) {
            return (
              <li key={member.userId}>
                <ProjectMemberChip name={member.username} profileImageUrl={member.profileImageUrl} state="self" />
              </li>
            );
          }

          return (
            <li key={member.userId}>
              <ProjectMemberChip
                name={member.username}
                profileImageUrl={member.profileImageUrl}
                state="self"
                removable
                onRemove={() => {
                  if (isPending) {
                    return;
                  }
                  deleteMember(member.userId);
                }}
              />
            </li>
          );
        })}
      </ul>
    </SectionInfoRow>
  );
};
