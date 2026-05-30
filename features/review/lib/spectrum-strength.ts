/** 후기 작성 UI 스텝퍼 단계 수 (0 ~ STEP_COUNT - 1) */
export const SPECTRUM_STEP_COUNT = 6;

/**
 * BE spectrumStrength / averageStrength 는 1~5 Likert 척도.
 * UI 6단계(0~5)를 1~5로 매핑한다.
 */
export const spectrumStepToStrength = (step: number): number => {
  const clamped = Math.min(Math.max(step, 0), SPECTRUM_STEP_COUNT - 1);
  return Math.round((clamped / (SPECTRUM_STEP_COUNT - 1)) * 4) + 1;
};

/** 프로필 표시용 — API가 0~100으로 내려오는 레거시 값도 1~5로 정규화 */
export const normalizeSpectrumStrength = (value: number): number => {
  if (value <= 5) {
    return value;
  }
  return Math.min(5, Math.max(1, value / 20));
};

export const spectrumStrengthToMarkerPercent = (strength: number): string =>
  `${(normalizeSpectrumStrength(strength) / 5) * 100}%`;
