import { normalizeStrength } from './normalize-strength';

const STRENGTH_RANGE = 5;

/** 평균 강도(1=좌, 6=우)를 마커 CSS `left` 퍼센트로 변환합니다. */
export const toMarkerLeft = (averageStrength: number): string => {
  const strength = normalizeStrength(averageStrength);
  const percent = ((strength - 1) / STRENGTH_RANGE) * 100;

  return `${percent}%`;
};
