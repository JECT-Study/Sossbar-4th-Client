/**
 * 협업 성향 4축의 좌·우 끝 라벨.
 * API 축 순서와 동일하며, 스펙트럼 UI와 분포 차트에서 함께 사용합니다.
 */
export const spectrumAxisLabels = [
  { left: '서포트형', right: '리드형' },
  { left: '빠른 작업 속도 중시', right: '천천히 신중한 고민 중시' },
  { left: '상황별 유연한 대처', right: '철저한 계획 기반 실행' },
  { left: '냉철한 결과 지향', right: '따뜻한 관계 지향' },
] as const;

/** Figma 4262:76471 — 평균 지표 좌측 트랙 (skyblue-subtler → primary-500) */
export const SPECTRUM_LEFT_TRACK_CLASS = 'bg-gradient-to-r from-graphic-skyblue-subtler to-primary-500';

/** Figma 4262:76471 — 평균 지표 우측 트랙 (tertiary-500 → yellow-500) */
export const SPECTRUM_RIGHT_TRACK_CLASS = 'bg-gradient-to-r from-tertiary-500 to-yellow-500';

/** Figma 4262:76471 — 평가 분포 좌측(왼쪽 성향) 막대 */
export const DISTRIBUTION_LEFT_BAR_CLASS = 'bg-gradient-to-t from-graphic-skyblue-subtler to-primary-500';

/** Figma 4262:76471 — 평가 분포 우측(오른쪽 성향) 막대 */
export const DISTRIBUTION_RIGHT_BAR_CLASS = 'bg-gradient-to-b from-tertiary-500 to-yellow-500';

export const SPECTRUM_MARKER_CLASS =
  'border-border-gray-dark bg-bg-white absolute top-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[2px] border';
