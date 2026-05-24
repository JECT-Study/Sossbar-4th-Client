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
