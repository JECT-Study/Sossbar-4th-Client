export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
export type MemberStatus = 'LEADER' | 'MEMBER';

export interface ProjectMemberResponse {
  projectMemberId: number;
  userId: number;
  username: string;
  profileImageUrl: string | null;
  memberStatus: MemberStatus;
  reviewWritten?: boolean;
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

export interface ProjectCreateRequest {
  projectName: string;
  host: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ProjectUpdateRequest {
  projectName?: string;
  host?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export type CreateProjectPayload = {
  request: ProjectCreateRequest;
  image?: File | null;
};

export type UpdateProjectPayload = {
  request: ProjectUpdateRequest;
  image?: File | null;
};
