import type { DistributionBar } from '../distribution-bar.types';
import type { SpectrumAxisInfo } from '../soft-skills.types';

import { spectrumAxisLabels } from '../constants/spectrum-axis-labels';

/** 축별 좌·우 응답 수를 분포 차트 막대 목록으로 펼칩니다. */
export const toDistributionBars = (axes: SpectrumAxisInfo[]): DistributionBar[] =>
  axes.flatMap((axis, index) => {
    const row = spectrumAxisLabels[index];

    return [
      { label: row.left, count: axis.leftStrengthCount },
      { label: row.right, count: axis.rightStrengthCount },
    ];
  });
