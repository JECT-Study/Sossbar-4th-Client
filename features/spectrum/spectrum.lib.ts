import type { DistributionBar, DistributionBarTone, SpectrumAxisInfo } from './spectrum.types';

import { spectrumAxisLabels } from './spectrum.constants';

const RANK_TONES: DistributionBarTone[] = ['first', 'second', 'third'];

/** 응답 수 상위 3개 막대에 하이라이트 톤을 부여합니다. */
export const assignBarTones = (bars: DistributionBar[]): DistributionBarTone[] => {
  const topCounts = Array.from(new Set(bars.map((bar) => bar.count)))
    .filter((count) => count > 0)
    .sort((a, b) => b - a)
    .slice(0, RANK_TONES.length);

  return bars.map((bar) => {
    const rank = topCounts.indexOf(bar.count);
    return rank >= 0 ? RANK_TONES[rank] : 'none';
  });
};

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

/** 막대+인원 수가 차지하는 스택 영역 높이(px) */
const BAR_STACK_HEIGHT_PX = 198;

/** 스택 상단 인원 수 텍스트 높이(px) */
const COUNT_TEXT_HEIGHT_PX = 18;

/** 0명 응답 막대도 영역을 유지하기 위한 최소 높이(px) */
const BAR_HEIGHT_MIN_PX = 1;

/** 인원 수 텍스트를 제외한 막대가 그려질 수 있는 최대 높이(px) */
const BAR_HEIGHT_MAX_PX = BAR_STACK_HEIGHT_PX - COUNT_TEXT_HEIGHT_PX;

/** 응답 수를 차트 막대 높이(px)로 스케일링합니다. */
export const scaleBarHeight = (count: number, maxCount: number): number => {
  if (count <= 0 || maxCount <= 0) {
    return BAR_HEIGHT_MIN_PX;
  }

  const ratio = count / maxCount;

  return Math.round(BAR_HEIGHT_MIN_PX + ratio * (BAR_HEIGHT_MAX_PX - BAR_HEIGHT_MIN_PX));
};

/** 축별 좌·우 응답 수를 분포 차트 막대 목록으로 펼칩니다. */
export const toDistributionBars = (axes: SpectrumAxisInfo[]): DistributionBar[] =>
  axes.flatMap((axis, index) => {
    const row = spectrumAxisLabels[index];

    return [
      { label: row.left, count: axis.leftStrengthCount },
      { label: row.right, count: axis.rightStrengthCount },
    ];
  });

const STRENGTH_RANGE = 5;

/** 평균 강도(1=좌, 6=우)를 마커 CSS `left` 퍼센트로 변환합니다. */
export const toMarkerLeft = (averageStrength: number): string => {
  const strength = normalizeStrength(averageStrength);
  const percent = ((strength - 1) / STRENGTH_RANGE) * 100;

  return `${percent}%`;
};
