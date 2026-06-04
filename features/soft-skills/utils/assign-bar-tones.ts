import type { DistributionBar, DistributionBarTone } from '../distribution-bar.types';

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
