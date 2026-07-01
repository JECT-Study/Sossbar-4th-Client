export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
export type MemberStatus = 'LEADER' | 'MEMBER';
export type ProjectPosition = string;
export type ProjectUrlType = 'LINK';

export interface ProjectMemberResponse {
  projectMemberId: number;
  userId: number;
  username: string;
  profileImageUrl: string | null;
  memberStatus: MemberStatus;
  reviewWritten?: boolean;
  projectPositions?: ProjectPosition[];
}

export interface ProjectResponse {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string | null;
  endDate: string | null;
  projectLink: string;
  projectImage: string | null;
  projectStatus: ProjectStatus;
  members: ProjectMemberResponse[];
  memberCount: number;
  projectPositions: ProjectPosition[];
  projectUrl: string;
  projectUrlType: ProjectUrlType;
}

/** GET /api/v1/projects — 내 프로젝트 목록 */
export interface MyProjectResponse {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string | null;
  endDate: string | null;
  projectLink: string;
  projectImage: string | null;
  projectStatus: ProjectStatus;
  myMemberStatus: MemberStatus;
  members: ProjectMemberResponse[];
}

export type ProjectMemberReviewStatus = 'writable' | 'completed' | 'self';

export type ProjectCardMember = {
  /** 후기 작성 URL·식별에 사용 (BE userId) */
  memberId: number;
  name: string;
  reviewStatus: ProjectMemberReviewStatus;
};

export type ProjectCardItem = {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string;
  endDate: string;
  projectLink: string;
  projectImage: string | null;
  projectStatus: ProjectStatus;
  myMemberStatus: MemberStatus;
  members: readonly ProjectCardMember[];
};

export interface UserProjectResponse {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string;
  endDate: string;
  projectImage: string | null;
}

export interface ProjectRequest {
  projectName: string;
  host: string;
}

export type ProjectPayload = {
  request: ProjectRequest;
  image?: File | null;
};
