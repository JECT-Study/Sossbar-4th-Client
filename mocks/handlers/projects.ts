import { http, HttpResponse } from 'msw';

import type { ProjectResponse } from '@/features/project/types';

const BASE = '/api/v1';

const wrap = <T>(data: T) =>
  HttpResponse.json({
    status: 200,
    code: 'COMMON-200',
    message: '성공적으로 조회했습니다.',
    data,
  });

const mockProject: ProjectResponse = {
  projectId: 1,
  projectName: '소스바 프로젝트',
  host: 'JECT',
  startDate: '2025-03-01T00:00:00',
  endDate: '2025-06-30T00:00:00',
  projectLink: '30b2e693-ca41-4e26-96dc-da7e3a6a0de1',
  projectImage: null,
  projectStatus: 'IN_PROGRESS',
  members: [
    {
      projectMemberId: 1,
      userId: 1,
      username: '김재희',
      profileImageUrl: null,
      memberStatus: 'LEADER',
    },
    {
      projectMemberId: 2,
      userId: 2,
      username: '유하영',
      profileImageUrl: null,
      memberStatus: 'MEMBER',
    },
  ],
};

export const projectsHandlers = [
  http.get(`${BASE}/projects/:projectId`, ({ params }) => {
    const projectId = Number(params.projectId);
    if (projectId !== mockProject.projectId) {
      return HttpResponse.json(
        {
          status: 404,
          code: 'PROJECT-001',
          message: '해당 프로젝트가 없습니다.',
          data: null,
        },
        { status: 404 },
      );
    }
    return wrap(mockProject);
  }),

  http.post(`${BASE}/projects`, async () => {
    return wrap({ ...mockProject, projectId: 3 });
  }),

  http.patch(`${BASE}/projects/:projectId`, () => wrap(mockProject)),

  http.delete(`${BASE}/projects/:projectId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${BASE}/projects/invite/:projectId`, () => wrap(null)),

  http.delete(`${BASE}/projects/:projectId/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${BASE}/projects/confirm/:projectId`, () => wrap(null)),
];
