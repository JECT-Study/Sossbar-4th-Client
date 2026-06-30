import { cn } from '@/shared/lib/cn';

import type { SpectrumInfo } from '../types/soft-skills.types';

import { DISTRIBUTION_LEFT_BAR_CLASS, DISTRIBUTION_RIGHT_BAR_CLASS } from '../constants/spectrum-visual.constants';
import { scaleBarHeight } from '../utils/scale-bar-height';
import { toDistributionBars } from '../utils/to-distribution-bars';

/** 막대+인원 수 스택 영역 높이(px) — scaleBarHeight와 동일 기준 */
const BAR_STACK_HEIGHT_PX = 198;

/** 막대 하단 라벨과 스택 사이 간격(px) */
const LABEL_GAP_PX = 8;

/** 막대 하단 라벨 영역 높이(px) */
const LABEL_HEIGHT_PX = 36;

/** 분포 차트 전체 높이: 스택 + 라벨 간격 + 라벨 */
const CHART_TOTAL_HEIGHT_PX = BAR_STACK_HEIGHT_PX + LABEL_GAP_PX + LABEL_HEIGHT_PX;

interface Props {
  spectrumInfo: SpectrumInfo;
}

export const SoftSkillsDistribution = ({ spectrumInfo }: Props) => {
  const bars = toDistributionBars(spectrumInfo.spectrumInfoResDtos);
  const maxCount = Math.max(...bars.map((bar) => bar.count), 0);

  return (
    <div className="mt-6 w-full">
      <h3 className="text-heading-xs text-text-subtle pb-2 font-bold">평가 분포</h3>

      <div className="flex w-full items-end justify-center gap-2" style={{ height: CHART_TOTAL_HEIGHT_PX }}>
        {bars.map((bar, index) => {
          const isLeftTrait = index % 2 === 0;
          const barHeightPx = bar.count === 0 ? 1 : scaleBarHeight(bar.count, maxCount);

          return (
            <div key={bar.label} className="flex w-[58.625px] flex-col items-center">
              <span className="text-detail-xs text-text-subtle flex h-[18px] shrink-0 items-center justify-center text-center font-medium">
                {bar.count}명
              </span>
              <div
                className={cn(
                  'w-10 shrink-0 rounded-tl-[12px] rounded-tr-[12px] rounded-br rounded-bl-[4px]',
                  isLeftTrait ? DISTRIBUTION_LEFT_BAR_CLASS : DISTRIBUTION_RIGHT_BAR_CLASS,
                )}
                style={{ height: `${barHeightPx}px` }}
              />
              <div className="text-detail-xs text-text-subtle mt-2 flex h-9 shrink-0 items-start justify-center text-center font-medium break-keep whitespace-pre-line">
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
