import { SHARE_INVITER_NAME_PARAM } from '@/shared/constants/share-query';
import { getSiteOrigin } from '@/shared/lib/get-site-origin';

/** 이미지를 Canvas로 재인코딩해 maxBytes 이하로 압축한다. nginx 1MB 업로드 제한 대응. */
export const compressImage = (file: File, maxBytes = 900 * 1024): Promise<File> => {
  if (file.size <= maxBytes) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const MAX_DIMENSION = 1920;
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      const attempt = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            if (blob.size <= maxBytes || quality <= 0.3) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
            } else {
              quality = parseFloat((quality - 0.1).toFixed(1));
              attempt();
            }
          },
          'image/jpeg',
          quality,
        );
      };
      attempt();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

import type {
  MyProjectResponse,
  ProjectCardItem,
  ProjectCardMember,
  ProjectMemberResponse,
  ProjectMemberReviewStatus,
} from './project.types';
import type { QueryClient } from '@tanstack/react-query';

import { projectKeys } from './project.api';

export const PROJECT_INVITE_QUERY_KEY = 'invite';

export const parseProjectInviteLink = (raw: string | null): string | null => {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
};

export const buildProjectInviteUrl = (projectLink: string, inviterName?: string): string => {
  const searchParams = new URLSearchParams({
    [PROJECT_INVITE_QUERY_KEY]: projectLink,
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

/** 프로젝트 목록·프로필 탭 등 목록성 쿼리 갱신. sort/status 조합과 무관하게 모든 목록 캐시를 무효화한다. */
export const invalidateProjectListQueries = (queryClient: QueryClient, userLink?: string) => {
  void queryClient.invalidateQueries({ queryKey: [...projectKeys.all, 'list'] });

  if (userLink) {
    void queryClient.invalidateQueries({ queryKey: projectKeys.byUser(userLink) });
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
          projectPositions: [],
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
    projectUrl: project.projectUrl ?? '',
    projectUrlType: 'LINK',
    members: members.map((member) => toCardMember(member, sessionUserId)),
    reviewedCount: project.reviewedCount ?? 0,
    totalReviewTargetCount: project.totalReviewTargetCount ?? 0,
  };
};

export const mapMyProjectsToCardItems = (projects: MyProjectResponse[], sessionUser: SessionInfo): ProjectCardItem[] =>
  projects.map((project) => mapMyProjectToCardItem(project, sessionUser));
