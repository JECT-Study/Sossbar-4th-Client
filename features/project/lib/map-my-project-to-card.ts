import type {
  MyProjectResponse,
  ProjectCardItem,
  ProjectCardMember,
  ProjectMemberResponse,
  ProjectMemberReviewStatus,
} from '@/features/project/types';

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

export const mapMyProjectToCardItem = (project: MyProjectResponse, sessionUserId: number): ProjectCardItem => ({
  projectId: project.projectId,
  projectName: project.projectName,
  host: project.host,
  startDate: toDateString(project.startDate),
  endDate: toDateString(project.endDate),
  projectLink: project.projectLink,
  projectImage: project.projectImage,
  projectStatus: project.projectStatus,
  myMemberStatus: project.myMemberStatus,
  members: project.members.map((member) => toCardMember(member, sessionUserId)),
});

export const mapMyProjectsToCardItems = (projects: MyProjectResponse[], sessionUserId: number): ProjectCardItem[] =>
  projects.map((project) => mapMyProjectToCardItem(project, sessionUserId));
