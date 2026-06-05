const MIN_STRENGTH = 1;
const MAX_STRENGTH = 6;
const LEGACY_STRENGTH_SCALE = 20;

/** 스펙트럼 강도를 UI 스케일(1–6)로 맞춥니다. 구 API 0–100 값도 환산합니다. */
export const normalizeStrength = (strength: number): number => {
  if (strength > MAX_STRENGTH) {
    return Math.max(MIN_STRENGTH, Math.min(MAX_STRENGTH, Math.round(strength / LEGACY_STRENGTH_SCALE) + 1));
  }

  return Math.round(strength);
};
