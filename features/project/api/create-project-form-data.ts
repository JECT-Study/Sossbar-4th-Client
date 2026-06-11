import type { ProjectRequest } from '../types';

export const createProjectFormData = (request: ProjectRequest, image?: File | null): FormData => {
  const formData = new FormData();

  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
  if (image) {
    formData.append('image', image);
  }

  return formData;
};
