import { http, HttpResponse } from 'msw';

import type { MyProjectResponse, ProjectMemberResponse, ProjectResponse } from '@/features/project';

import { isMockReviewSubmitted } from '../lib/submitted-reviews';

const BASE = '/api/v1';

const wrap = <T>(data: T) =>
  HttpResponse.json({
    status: 200,
    code: 'COMMON-200',
    message: '성공적으로 조회했습니다.',
    data,
  });

// 방장 + 진행중 + 팀원 후기 일부 미작성
const mockProject1: ProjectResponse = {
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
      reviewWritten: false,
    },
    {
      projectMemberId: 2,
      userId: 2,
      username: '유하영',
      profileImageUrl: null,
      memberStatus: 'MEMBER',
      reviewWritten: true,
    },
    {
      projectMemberId: 7,
      userId: 3,
      username: '박민수',
      profileImageUrl: null,
      memberStatus: 'MEMBER',
      reviewWritten: false,
    },
  ],
};

// 팀원 + 완료 + 후기 모두 작성
const mockProject2: ProjectResponse = {
  projectId: 2,
  projectName: '디자인 시스템 구축',
  host: '유하영',
  startDate: '2025-01-01T00:00:00',
  endDate: '2025-02-28T00:00:00',
  projectLink: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  projectImage: null,
  projectStatus: 'COMPLETED',
  members: [
    {
      projectMemberId: 3,
      userId: 2,
      username: '유하영',
      profileImageUrl: null,
      memberStatus: 'LEADER',
      reviewWritten: true,
    },
    {
      projectMemberId: 4,
      userId: 1,
      username: '김재희',
      profileImageUrl: null,
      memberStatus: 'MEMBER',
      reviewWritten: true,
    },
  ],
};

// 방장 + 아카이브 + 후기 미작성
const mockProject3: ProjectResponse = {
  projectId: 3,
  projectName: '레거시 리팩토링',
  host: 'JECT',
  startDate: '2024-06-01T00:00:00',
  endDate: '2024-12-31T00:00:00',
  projectLink: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
  projectImage: null,
  projectStatus: 'ARCHIVED',
  members: [
    {
      projectMemberId: 5,
      userId: 1,
      username: '김재희',
      profileImageUrl: null,
      memberStatus: 'LEADER',
      reviewWritten: false,
    },
    {
      projectMemberId: 6,
      userId: 3,
      username: '박민수',
      profileImageUrl: null,
      memberStatus: 'MEMBER',
      reviewWritten: false,
    },
  ],
};

const mockProjects = [mockProject1, mockProject2, mockProject3];

/** GET /projects — 로그인 유저(userId 1) 기준, 본인 제외 팀원만 members */
let mockMyProjects: MyProjectResponse[] = [
  {
    projectId: 1,
    projectName: '소스바 프로젝트',
    host: 'JECT',
    startDate: '2025-03-01T00:00:00',
    endDate: '2025-06-30T00:00:00',
    projectLink: '30b2e693-ca41-4e26-96dc-da7e3a6a0de1',
    projectImage: null,
    projectStatus: 'IN_PROGRESS',
    myMemberStatus: 'LEADER',
    members: [
      {
        projectMemberId: 2,
        userId: 2,
        username: '유하영',
        profileImageUrl: null,
        memberStatus: 'MEMBER',
        reviewWritten: true,
      },
      {
        projectMemberId: 3,
        userId: 3,
        username: '한예진',
        profileImageUrl: null,
        memberStatus: 'MEMBER',
        reviewWritten: false,
      },
    ],
  },
  {
    projectId: 2,
    projectName: '디자인 시스템 구축',
    host: '유하영',
    startDate: '2025-01-01T00:00:00',
    endDate: '2025-02-28T00:00:00',
    projectLink: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    projectImage: null,
    projectStatus: 'COMPLETED',
    myMemberStatus: 'MEMBER',
    members: [
      {
        projectMemberId: 3,
        userId: 2,
        username: '유하영',
        profileImageUrl: null,
        memberStatus: 'LEADER',
        reviewWritten: true,
      },
    ],
  },
];

function withSubmittedReviewFlags(projects: MyProjectResponse[]): MyProjectResponse[];
function withSubmittedReviewFlags(projects: ProjectResponse[]): ProjectResponse[];
function withSubmittedReviewFlags(
  projects: MyProjectResponse[] | ProjectResponse[],
): MyProjectResponse[] | ProjectResponse[] {
  return projects.map((project) => ({
    ...project,
    members: project.members.map(
      (member): ProjectMemberResponse => ({
        ...member,
        reviewWritten: member.reviewWritten === true || isMockReviewSubmitted(project.projectId, member.userId),
      }),
    ),
  }));
}

export const projectsHandlers = [
  http.get(`${BASE}/projects`, () => wrap(withSubmittedReviewFlags(mockMyProjects))),

  http.get(`${BASE}/projects/:projectId`, ({ params }) => {
    const projectId = Number(params.projectId);
    const project = mockProjects.find((p) => p.projectId === projectId);
    if (!project) {
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
    return wrap(withSubmittedReviewFlags([project])[0]);
  }),

  http.post(`${BASE}/projects`, async () => {
    return wrap({ ...mockProject1, projectId: 99 });
  }),

  http.patch(`${BASE}/projects/:projectId`, ({ params }) => {
    const projectId = Number(params.projectId);
    const project = mockProjects.find((p) => p.projectId === projectId) ?? mockProject1;
    return wrap(project);
  }),

  http.delete(`${BASE}/projects/:projectId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${BASE}/projects/invite/:projectId`, () => wrap(null)),

  http.delete(`${BASE}/projects/:projectId/:userId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${BASE}/projects/confirm/:projectId`, ({ params }) => {
    const projectId = Number(params.projectId);
    mockMyProjects = mockMyProjects.map((project) =>
      project.projectId === projectId ? { ...project, projectStatus: 'COMPLETED' } : project,
    );
    return wrap(null);
  }),
];
