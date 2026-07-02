import { apiRequest } from '@/shared/lib/api';
import type { ApiRequestOptions } from '@/shared/lib/api';

import type {
  FetchMyProjectsParams,
  MyProjectResponse,
  ProjectPayload,
  ProjectPositionValue,
  ProjectRequest,
  ProjectResponse,
  UserProjectResponse,
} from './project.types';

export const projectKeys = {
  all: ['project'] as const,
  list: (params: FetchMyProjectsParams) => [...projectKeys.all, 'list', params] as const,
  detail: (projectId: number) => [...projectKeys.all, 'detail', projectId] as const,
  byUser: (userLink: string) => [...projectKeys.all, 'byUser', userLink] as const,
};

const createProjectFormData = (request: ProjectRequest, image?: File | null): FormData => {
  const formData = new FormData();

  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
  if (image) {
    formData.append('image', image);
  }

  return formData;
};

/** GET /api/v1/projects 내 프로젝트 목록 */
export const fetchProjects = (
  { sort, status }: FetchMyProjectsParams,
  init?: ApiRequestOptions,
): Promise<MyProjectResponse[]> => {
  const params = new URLSearchParams({ sort, status });
  return apiRequest<MyProjectResponse[]>(`/projects?${params}`, init);
};

/** GET /api/v1/projects/{projectId} 프로젝트 조회 */
export const fetchProject = (projectId: number): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>(`/projects/${projectId}`);

/** GET /api/v1/projects/users/{userLink} 유저별 프로젝트 목록 조회 */
export const fetchUserProjects = (userLink: string): Promise<UserProjectResponse[]> =>
  apiRequest<UserProjectResponse[]>(`/projects/users/${userLink}`);

/** DELETE /api/v1/projects/{projectId} 프로젝트 삭제 */
export const deleteProject = (projectId: number): Promise<void> =>
  apiRequest<void>(`/projects/${projectId}`, { method: 'DELETE' });

/** POST /api/v1/projects/invite/{projectLink} 팀원 추가 (본인 초대 수락) */
export const inviteProjectMember = (projectLink: string, projectPositions: ProjectPositionValue[]): Promise<void> =>
  apiRequest<void>(`/projects/invite/${projectLink}`, {
    method: 'POST',
    body: { projectPositions },
  });

/** DELETE /api/v1/projects/{projectId}/{userId} 팀원 삭제 */
export const deleteProjectMember = (projectId: number, userId: number): Promise<void> =>
  apiRequest<void>(`/projects/${projectId}/${userId}`, { method: 'DELETE' });

/** PATCH /api/v1/projects/confirm/{projectId} 팀원 확정 */
export const confirmProjectMembers = (projectId: number): Promise<void> =>
  apiRequest<void>(`/projects/confirm/${projectId}`, { method: 'PATCH' });

/** POST /api/v1/projects 프로젝트 생성 */
export const createProject = ({ request, image }: ProjectPayload): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>('/projects', {
    method: 'POST',
    body: createProjectFormData(request, image),
  });

/** PATCH /api/v1/projects/{projectId} 프로젝트 수정 */
export const updateProject = (projectId: number, { request, image }: ProjectPayload): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>(`/projects/${projectId}`, {
    method: 'PATCH',
    body: createProjectFormData(request, image),
  });
