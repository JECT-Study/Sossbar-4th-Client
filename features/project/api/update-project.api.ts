import { apiRequest } from '@/shared/lib/api';

import type { ProjectResponse, ProjectPayload } from '../types';

import { createProjectFormData } from './create-project-form-data';

export const updateProject = (projectId: number, { request, image }: ProjectPayload): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>(`/projects/${projectId}`, {
    method: 'PATCH',
    body: createProjectFormData(request, image),
  });
