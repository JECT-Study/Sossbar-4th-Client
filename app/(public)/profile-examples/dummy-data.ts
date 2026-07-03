import type { PublicProfile } from '@/features/profile';
import type { UserProjectResponse } from '@/features/project/project.types';
import type { Review } from '@/features/review/review.types';
import type { SpectrumInfo } from '@/features/spectrum/spectrum.types';
import type { ReceivedTags } from '@/features/tag/tag.types';

export const dummyProfile: PublicProfile = {
  userId: 999,
  userLink: 'example-user',
  username: '김민준',
  bio: '함께 만드는 과정을 즐기는 프론트엔드 개발자입니다.',
  profileImageUrl: '/profile-example.png',
  defaultPositions: ['FE'],
  links: [
    { linkId: 1, userLinkType: 'GITHUB', userLink: 'https://github.com' },
    { linkId: 2, userLinkType: 'NOTION', userLink: 'https://notion.so' },
    { linkId: 3, userLinkType: 'LINKEDIN', userLink: 'https://linkedin.com' },
  ],
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
    { tagId: 5, tagName: '아이디어가 많아요', count: 5 },
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
    feedback:
      '초기 기획 단계에서 화면별 우선순위를 먼저 정리해 주셔서 팀이 같은 기준으로 움직일 수 있었습니다. 디자인 변경이 잦았는데도 컴포넌트 단위로 빠르게 반영했고, 배포 직전 발견된 반응형 이슈도 원인을 짚어 안정적으로 해결해 주셨어요.',
    reviewerNickname: '김디자이너',
    projectPosition: 'FE',
    projectStatus: 'COMPLETED',
  },
  {
    reviewId: 2,
    projectName: 'AI 스프린트 대시보드',
    host: '모던 스터디',
    projectImage: null,
    createdAt: '2026-05-14T09:30:00.000Z',
    feedback:
      '대시보드 지표 정의가 계속 바뀌는 상황에서도 회의 내용을 기능 단위로 정리해 주셔서 백엔드 작업 범위를 맞추기 좋았습니다. API 응답이 늦게 확정된 부분은 임시 데이터 구조를 먼저 제안해 화면 개발을 진행했고, 실제 연동 때도 수정 범위를 작게 유지해 주셨어요.',
    reviewerNickname: '이백엔드',
    projectPosition: 'BE',
    projectStatus: 'COMPLETED',
  },
  {
    reviewId: 3,
    projectName: '해커톤 24H',
    host: '스픽 커뮤니티',
    projectImage: null,
    createdAt: '2026-04-02T18:00:00.000Z',
    feedback:
      '해커톤처럼 시간이 짧은 프로젝트에서 MVP 범위를 빠르게 좁히고, 발표에 꼭 필요한 사용자 흐름부터 완성한 점이 좋았습니다. 구현 중 막히는 부분이 생기면 혼자 오래 붙잡기보다 팀원에게 바로 공유했고, 덕분에 마지막까지 화면 완성도와 발표 준비를 같이 챙길 수 있었습니다.',
    reviewerNickname: '박PM',
    projectPosition: 'PM',
    projectStatus: 'COMPLETED',
  },
];

export const dummyProjects: UserProjectResponse[] = [
  {
    projectId: 1,
    projectName: '소스바 리브랜딩',
    host: '소스바',
    startDate: '2026-03-01',
    endDate: '2026-06-01',
    projectImage: '/project_example_1.jpg',
    projectPositions: ['FE'],
    projectUrl: 'https://www.surfit.io/profile/1605155595',
    projectUrlType: 'LINK',
  },
  {
    projectId: 2,
    projectName: 'AI 스프린트 대시보드',
    host: '모던 스터디',
    startDate: '2026-01-15',
    endDate: '2026-05-14',
    projectImage: '/project_example_2.jpg',
    projectPositions: ['FE'],
    projectUrl: '',
    projectUrlType: 'LINK',
  },
];
