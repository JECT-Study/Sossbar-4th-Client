import { apiRequest } from '@/shared/lib/api';

import type {
  MyProjectResponse,
  ProjectPayload,
  ProjectRequest,
  ProjectResponse,
  UserProjectResponse,
} from './project.types';

export const projectKeys = {
  all: ['project'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (projectId: number) => [...projectKeys.all, 'detail', projectId] as const,
  byUser: (userId: number) => [...projectKeys.all, 'byUser', userId] as const,
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
export const fetchProjects = (): Promise<MyProjectResponse[]> => apiRequest<MyProjectResponse[]>('/projects');

/** GET /api/v1/projects/{projectId} 프로젝트 조회 */
export const fetchProject = (projectId: number): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>(`/projects/${projectId}`);

/** GET /api/v1/projects/users/{userId} 유저별 프로젝트 목록 조회 */
export const fetchUserProjects = (userId: number): Promise<UserProjectResponse[]> =>
  apiRequest<UserProjectResponse[]>(`/projects/users/${userId}`);

/** DELETE /api/v1/projects/{projectId} 프로젝트 삭제 */
export const deleteProject = (projectId: number): Promise<void> =>
  apiRequest<void>(`/projects/${projectId}`, { method: 'DELETE' });

/** POST /api/v1/projects/invite/{projectId} 팀원 추가 (본인 초대 수락) */
export const inviteProjectMember = (projectId: number): Promise<void> =>
  apiRequest<void>(`/projects/invite/${projectId}`, { method: 'POST' });

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
