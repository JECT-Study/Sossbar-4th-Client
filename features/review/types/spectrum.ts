export type Spectrum = {
  spectrumId: number;
  leftLabel: string;
  rightLabel: string;
};

export type SpectrumWithValue = {
  spectrumId: number;
  value: number;
};

export type SpectrumAxisInfo = {
  spectrumAxisId: number;
  axisName: string;
  averageStrength: number;
  totalCount: number;
  leftStrengthCount: number;
  rightStrengthCount: number;
};
