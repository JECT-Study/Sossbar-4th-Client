import { SHARE_INVITER_NAME_PARAM } from '@/shared/constants/share-query';
import { getSiteOrigin } from '@/shared/lib/get-site-origin';

import type {
  MyProjectResponse,
  ProjectCardItem,
  ProjectCardMember,
  ProjectMemberResponse,
  ProjectMemberReviewStatus,
  ProjectResponse,
} from './project.types';
import type { QueryClient } from '@tanstack/react-query';

import { projectKeys } from './project.api';

export const PROJECT_INVITE_QUERY_KEY = 'inviteProjectId';

export const parseProjectInviteId = (raw: string | null): number | null => {
  if (raw == null || raw.trim() === '') {
    return null;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const buildProjectInviteUrl = (projectId: number, inviterName?: string): string => {
  const searchParams = new URLSearchParams({
    [PROJECT_INVITE_QUERY_KEY]: String(projectId),
  });

  const trimmedName = inviterName?.trim();
  if (trimmedName) {
    searchParams.set(SHARE_INVITER_NAME_PARAM, trimmedName);
  }

  const path = `/projects?${searchParams.toString()}`;
  const origin = getSiteOrigin();

  return origin ? `${origin}${path}` : path;
};

type BuildReviewWriteUrlParams = {
  projectId: number;
  revieweeId: number;
  revieweeName: string;
};

export const buildReviewWriteUrl = ({ projectId, revieweeId, revieweeName }: BuildReviewWriteUrlParams): string => {
  const params = new URLSearchParams({
    projectId: String(projectId),
    revieweeId: String(revieweeId),
    reviewee: revieweeName,
  });

  return `/reviews/new?${params.toString()}`;
};

/** 프로젝트 목록·프로필 탭 등 목록성 쿼리 갱신 */
export const invalidateProjectListQueries = (queryClient: QueryClient, userId?: number) => {
  void queryClient.invalidateQueries({ queryKey: projectKeys.list() });

  if (userId != null && userId > 0) {
    void queryClient.invalidateQueries({ queryKey: projectKeys.byUser(userId) });
  }
};

type SessionInfo = { userId: number; nickname: string };

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

/** 방장 판단: 프로젝트의 members 배열에서 현재 유저가 LEADER인지 확인 */
export const isProjectLeader = (project: ProjectResponse, myUserId: number): boolean =>
  project.members.some((member) => member.userId === myUserId && member.memberStatus === 'LEADER');
