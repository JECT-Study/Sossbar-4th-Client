export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
export type MemberStatus = 'LEADER' | 'MEMBER';

/** GET /api/v1/projects의 sort 쿼리 파라미터 */
export type ProjectSort = 'LATEST' | 'OLDEST';

/** GET /api/v1/projects의 status 쿼리 파라미터 */
export type ProjectListFilterStatus = 'ALL' | 'IN_PROGRESS' | 'COMPLETED';

export interface FetchMyProjectsParams {
  sort: ProjectSort;
  status: ProjectListFilterStatus;
}

/** 프로젝트 내 직군. FE/BE/PM/PD/AI — review 도메인의 후기 작성 직군과 동일한 값 집합 */
export type ProjectPositionValue = 'FE' | 'BE' | 'PM' | 'PD';

/** 프로젝트의 외부 참고 링크 타입 */
export type ProjectUrlType = 'LINK';

export interface ProjectMemberResponse {
  projectMemberId: number;
  userId: number;
  username: string;
  profileImageUrl: string | null;
  memberStatus: MemberStatus;
  reviewWritten?: boolean;
  projectPositions?: ProjectPositionValue[];
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
  memberCount?: number;
  projectPositions?: ProjectPositionValue[];
  projectUrl?: string;
  projectUrlType?: ProjectUrlType;
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
  memberCount?: number;
  projectPositions?: ProjectPositionValue[];
  projectUrl?: string;
  projectUrlType?: ProjectUrlType;
  reviewedCount?: number;
  totalReviewTargetCount?: number;
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
  projectUrl: string;
  projectUrlType: 'LINK';
  members: readonly ProjectCardMember[];
  reviewedCount: number;
  totalReviewTargetCount: number;
};

/** GET /api/v1/projects/users/{userLink}/{projectId} — 특정 유저의 단일 프로젝트 조회 */
export interface UserProjectDetailResponse {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string | null;
  endDate: string | null;
  projectImage: string | null;
  projectPositions?: ProjectPositionValue[];
  projectUrl?: string;
  projectUrlType?: ProjectUrlType;
  createdAt?: string;
}

/** GET /api/v1/projects/users/{userLink} — 특정 유저가 속한 프로젝트 목록 */
export interface UserProjectResponse {
  projectId: number;
  projectName: string;
  host: string;
  startDate: string | null;
  endDate: string | null;
  projectImage: string | null;
  projectPositions?: ProjectPositionValue[];
  projectUrl?: string;
  projectUrlType?: ProjectUrlType;
}

export interface ProjectRequest {
  projectName: string;
  host: string;
  startDate: string;
  endDate: string;
  projectUrl: string;
  projectUrlType: 'LINK';
  projectPositions?: ProjectPositionValue[];
}

export type ProjectPayload = {
  request: ProjectRequest;
  image?: File | null;
};
