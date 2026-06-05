/**
 * 소프트 스킬 4축의 좌·우 끝 라벨.
 * API 축 순서와 동일하며, 스펙트럼 UI와 분포 차트에서 함께 사용합니다.
 */
export const spectrumAxisLabels = [
  { left: '서포트형', right: '리드형' },
  { left: '빠른 작업 속도 중시', right: '천천히 신중한 고민 중시' },
  { left: '상황별 유연한 대처', right: '철저한 계획 기반 실행' },
  { left: '냉철한 결과 지향', right: '따뜻한 관계 지향' },
] as const;
