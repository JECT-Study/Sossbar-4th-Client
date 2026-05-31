import type {
  MyProjectResponse,
  ProjectCardItem,
  ProjectCardMember,
  ProjectMemberResponse,
  ProjectMemberReviewStatus,
} from '@/features/project/types';
import type { SessionUser } from '@/shared/lib/session-user';

type SessionInfo = Pick<SessionUser, 'userId' | 'nickname'>;

const toReviewStatus = (member: ProjectMemberResponse, sessionUserId: number): ProjectMemberReviewStatus => {
  if (member.userId === sessionUserId) {
    return 'self';
  }
  if (member.reviewWritten === true) {
    return 'completed';
  }
  return 'writable';
};

const toCardMember = (member: ProjectMemberResponse, sessionUserId: number): ProjectCardMember => ({
  memberId: member.userId,
  name: member.username,
  reviewStatus: toReviewStatus(member, sessionUserId),
});

const toDateString = (value: string | null): string => value ?? '';

export const mapMyProjectToCardItem = (project: MyProjectResponse, sessionUser: SessionInfo): ProjectCardItem => {
  const { userId: sessionUserId, nickname } = sessionUser;

  // 백엔드가 members 배열에서 본인을 제외하는 경우 직접 추가
  const members = project.members.some((m) => m.userId === sessionUserId)
    ? project.members
    : [
        ...project.members,
        {
          projectMemberId: 0,
          userId: sessionUserId,
          username: nickname,
          profileImageUrl: null,
          memberStatus: project.myMemberStatus,
        } satisfies ProjectMemberResponse,
      ];

  return {
    projectId: project.projectId,
    projectName: project.projectName,
    host: project.host,
    startDate: toDateString(project.startDate),
    endDate: toDateString(project.endDate),
    projectLink: project.projectLink,
    projectImage: project.projectImage,
    projectStatus: project.projectStatus,
    myMemberStatus: project.myMemberStatus,
    members: members.map((member) => toCardMember(member, sessionUserId)),
  };
};

export const mapMyProjectsToCardItems = (projects: MyProjectResponse[], sessionUser: SessionInfo): ProjectCardItem[] =>
  projects.map((project) => mapMyProjectToCardItem(project, sessionUser));
