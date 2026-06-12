import { apiRequest } from '@/shared/lib/api';

import type { ProjectPayload, ProjectResponse } from '../types';

import { createProjectFormData } from './create-project-form-data';

export const createProject = ({ request, image }: ProjectPayload): Promise<ProjectResponse> =>
  apiRequest<ProjectResponse>('/projects', {
    method: 'POST',
    body: createProjectFormData(request, image),
  });
