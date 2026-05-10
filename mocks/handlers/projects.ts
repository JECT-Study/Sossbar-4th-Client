import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

const mockProjects = [
  {
    projectId: 1,
    name: '소스바 프론트엔드',
    organization: 'JECT',
    status: 1,
    members: [
      { userId: 1, nickname: '테스트유저', profileImageUrl: null },
      { userId: 2, nickname: '팀원A', profileImageUrl: null },
    ],
  },
  {
    projectId: 2,
    name: '사이드 프로젝트',
    organization: '개인',
    status: 2,
    members: [{ userId: 1, nickname: '테스트유저', profileImageUrl: null }],
  },
];

export const projectsHandlers = [
  http.get(`${BASE}/projects`, () => {
    return HttpResponse.json({ data: mockProjects });
  }),

  http.get(`${BASE}/projects/:projectId`, ({ params }) => {
    const project = mockProjects.find((p) => p.projectId === Number(params.projectId));
    if (!project) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: project });
  }),

  http.post(`${BASE}/projects`, async ({ request }) => {
    const body = (await request.json()) as { name: string; organization: string };
    return HttpResponse.json({ data: { projectId: 3, ...body, status: 1, members: [] } }, { status: 201 });
  }),

  http.patch(`${BASE}/projects/:projectId`, () => {
    return HttpResponse.json({ data: { projectId: 1 } });
  }),

  http.post(`${BASE}/projects/invite/:projectId`, () => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.delete(`${BASE}/projects/:projectId/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${BASE}/projects/confirm/:projectId`, () => {
    return HttpResponse.json({ data: { projectId: 1, status: 2 } });
  }),
];
