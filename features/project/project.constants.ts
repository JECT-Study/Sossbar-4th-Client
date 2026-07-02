import type { FetchMyProjectsParams, ProjectPositionValue } from './project.types';

export const PROJECT_FIELD_MAX_LENGTH = 20;

/** 프로젝트 직군 표시 라벨. review 도메인의 직군 라벨과 동일한 값 집합 */
export const PROJECT_POSITION_LABELS: Record<ProjectPositionValue, string> = {
  FE: '프론트엔드',
  BE: '백엔드',
  PM: 'PM',
  PD: 'PD',
  AI: 'AI',
};

export const PROJECT_POSITIONS = Object.keys(PROJECT_POSITION_LABELS) as ProjectPositionValue[];

/** 초대 수락 시 선택 가능한 최대 직군 수 (review projectPositions와 동일) */
export const PROJECT_INVITE_MAX_POSITIONS = 2;

export const PROJECT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export const PROJECT_IMAGE_ACCEPT = 'image/jpeg,image/jpg,image/png';

export const PROJECT_SORT_OPTIONS = [
  { value: 'LATEST', label: '최신순' },
  { value: 'OLDEST', label: '오래된 순' },
] as const;

export const PROJECT_LIST_STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'COMPLETED', label: '완료' },
] as const;

/** 백엔드 GET /api/v1/projects의 sort/status 기본값과 일치해야 SSR prefetch와 클라이언트 쿼리 키가 어긋나지 않는다 */
export const DEFAULT_PROJECT_LIST_PARAMS: FetchMyProjectsParams = {
  sort: 'LATEST',
  status: 'ALL',
};
