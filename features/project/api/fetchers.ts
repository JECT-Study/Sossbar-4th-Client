import { buildProjectMultipartFormData } from '@/features/project/lib/build-project-multipart';
import type {
  CreateProjectPayload,
  MyProjectResponse,
  ProjectResponse,
  UpdateProjectPayload,
} from '@/features/project/types';
import { apiRequest } from '@/shared/lib/api';

/** GET /api/v1/projects — 내 프로젝트 목록 */
export const fetchProjects = (): Promise<MyProjectResponse[]> => apiRequest<MyProjectResponse[]>('/projects');

/** GET /api/v1/projects/{projectId} — 프로젝트 조회 */
export const fetchProject = (projectId: number): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>(`/projects/${projectId}`);

/** POST /api/v1/projects — 프로젝트 생성 (multipart) */
export const createProject = ({ request, image }: CreateProjectPayload): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>('/projects', {
    method: 'POST',
    body: buildProjectMultipartFormData(request, image),
  });

/** PATCH /api/v1/projects/{projectId} — 프로젝트 수정 (multipart) */
export const updateProject = (projectId: number, { request, image }: UpdateProjectPayload): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>(`/projects/${projectId}`, {
    method: 'PATCH',
    body: buildProjectMultipartFormData(request, image),
  });

/** DELETE /api/v1/projects/{projectId} — 프로젝트 삭제 */
export const deleteProject = (projectId: number): Promise<void> =>
  apiRequest<void>(`/projects/${projectId}`, { method: 'DELETE' });

/** POST /api/v1/projects/invite/{projectId} — 팀원 추가 (본인 초대 수락) */
export const inviteProjectMember = (projectId: number): Promise<void> =>
  apiRequest<void>(`/projects/invite/${projectId}`, { method: 'POST' });

/** DELETE /api/v1/projects/{projectId}/{userId} — 팀원 삭제 */
export const deleteProjectMember = (projectId: number, userId: number): Promise<void> =>
  apiRequest<void>(`/projects/${projectId}/${userId}`, { method: 'DELETE' });

/** PATCH /api/v1/projects/confirm/{projectId} — 팀원 확정 */
export const confirmProjectMembers = (projectId: number): Promise<void> =>
  apiRequest<void>(`/projects/confirm/${projectId}`, { method: 'PATCH' });
