import type { PublicProfile } from '@/features/profile';
import type { UserProjectResponse } from '@/features/project/project.types';
import type { Review } from '@/features/review/review.types';
import type { SpectrumInfo } from '@/features/spectrum/spectrum.types';
import type { ReceivedTags } from '@/features/tag/tag.types';

export const dummyProfile: PublicProfile = {
  userId: 999,
  userLink: 'example-user',
  username: '홍길동',
  bio: '커뮤니케이션과 실행력을 중요하게 생각하는 프론트엔드 개발자입니다.',
  profileImageUrl: null,
  defaultPositions: ['FE'],
  links: [],
};

export const dummyReceivedTags: ReceivedTags = {
  top3Tags: [
    { tagId: 1, tagName: '책임감이 강해요', count: 12 },
    { tagId: 2, tagName: '커뮤니케이션이 원활해요', count: 9 },
    { tagId: 3, tagName: '문제 해결이 빨라요', count: 7 },
  ],
  allTags: [
    { tagId: 1, tagName: '책임감이 강해요', count: 12 },
    { tagId: 2, tagName: '커뮤니케이션이 원활해요', count: 9 },
    { tagId: 3, tagName: '문제 해결이 빨라요', count: 7 },
    { tagId: 4, tagName: '꼼꼼해요', count: 6 },
    { tagId: 5, tagName: '아이디어가 풍부해요', count: 5 },
    { tagId: 6, tagName: '리더십이 있어요', count: 4 },
    { tagId: 7, tagName: '주도적으로 일해요', count: 4 },
    { tagId: 8, tagName: '분위기를 잘 만들어요', count: 3 },
    { tagId: 9, tagName: '피드백을 잘 반영해요', count: 3 },
    { tagId: 10, tagName: '시간 약속을 잘 지켜요', count: 2 },
  ],
};

export const dummySpectrumInfo: SpectrumInfo = {
  totalCount: 18,
  spectrumInfoResDtos: [
    { spectrumAxisId: 1, axisName: '리드-서포트', averageStrength: 68, leftStrengthCount: 6, rightStrengthCount: 12 },
    { spectrumAxisId: 2, axisName: '속도-신중', averageStrength: 42, leftStrengthCount: 11, rightStrengthCount: 7 },
    { spectrumAxisId: 3, axisName: '유연-계획', averageStrength: 55, leftStrengthCount: 8, rightStrengthCount: 10 },
    { spectrumAxisId: 4, axisName: '결과-관계', averageStrength: 73, leftStrengthCount: 5, rightStrengthCount: 13 },
  ],
};

export const dummyReviews: Review[] = [
  {
    reviewId: 1,
    projectName: '소스바 리브랜딩',
    host: '소스바',
    projectImage: null,
    createdAt: '2026-06-01T10:00:00.000Z',
    feedback: '초기 기획부터 릴리즈까지 안정적으로 리드해 주셨어요. 이슈 대응 속도도 인상적이었습니다.',
    reviewerNickname: '김디자이너',
    projectPosition: 'FRONTEND',
    projectStatus: 'COMPLETED',
  },
  {
    reviewId: 2,
    projectName: '팀 스프린트 대시보드',
    host: '내부 스터디',
    projectImage: null,
    createdAt: '2026-05-14T09:30:00.000Z',
    feedback: '팀원 의견을 잘 정리해 주고, 문제 해결에 필요한 리소스를 빠르게 찾아왔어요.',
    reviewerNickname: '이백엔드',
    projectPosition: 'BACKEND',
    projectStatus: 'COMPLETED',
  },
  {
    reviewId: 3,
    projectName: '해커톤 24H',
    host: '오픈 커뮤니티',
    projectImage: null,
    createdAt: '2026-04-02T18:00:00.000Z',
    feedback: '짧은 시간 안에 결과물을 만들어내는 실행력이 강점이에요.',
    reviewerNickname: '박PM',
    projectPosition: 'PM',
    projectStatus: 'COMPLETED',
  },
];

export const dummyProjects: UserProjectResponse[] = [
  {
    projectId: 101,
    projectName: '소스바 리브랜딩',
    host: '소스바',
    startDate: '2026-03-01',
    endDate: '2026-06-01',
    projectImage: null,
  },
  {
    projectId: 102,
    projectName: '팀 스프린트 대시보드',
    host: '내부 스터디',
    startDate: '2026-01-15',
    endDate: '2026-05-14',
    projectImage: null,
  },
  {
    projectId: 103,
    projectName: '해커톤 24H',
    host: '오픈 커뮤니티',
    startDate: '2026-04-01',
    endDate: '2026-04-02',
    projectImage: null,
  },
];
