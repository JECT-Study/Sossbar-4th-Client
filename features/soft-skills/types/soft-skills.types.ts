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
