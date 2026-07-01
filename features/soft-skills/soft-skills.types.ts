export interface SpectrumAxisInfo {
  spectrumAxisId: number;
  axisName: string;
  averageStrength: number;
  leftStrengthCount: number;
  rightStrengthCount: number;
}

export interface SpectrumInfo {
  totalCount: number;
  spectrumInfoResDtos: SpectrumAxisInfo[];
}

/** 분포 차트 막대 1개 (라벨 + 응답 수) */
export interface DistributionBar {
  label: string;
  count: number;
}

/** 응답 수 순위에 따른 막대 강조 색상 단계 */
export type DistributionBarTone = 'first' | 'second' | 'third' | 'none';
