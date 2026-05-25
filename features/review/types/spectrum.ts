export type Spectrum = {
  spectrumId: number;
  leftLabel: string;
  rightLabel: string;
};

export type SpectrumWithValue = {
  spectrumId: number;
  value: number;
};

export type SpectrumInfo = {
  spectrumAxisId: number;
  axisName: string;
  averageStrength: number;
  totalCount: number;
  leftStrengthCount: number;
  rightStrengthCount: number;
};

export type SpectrumStats = {
  spectrumInfoResDtos: SpectrumInfo[];
};
