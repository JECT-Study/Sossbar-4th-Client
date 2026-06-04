import { cn } from '@/shared/lib/cn';

import type { DistributionBarTone } from '../types/distribution-bar.types';
import type { SpectrumInfo } from '../types/soft-skills.types';

import { assignBarTones } from '../utils/assign-bar-tones';
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

/** DistributionBarTone 순위별 Tailwind 배경 클래스 */
const barToneBgClasses: Record<DistributionBarTone, string> = {
  first: 'bg-graphic-yellow',
  second: 'bg-graphic-yellow-subtle',
  third: 'bg-graphic-yellow-subtler',
  none: 'bg-gray-300',
};

export const SoftSkillsDistribution = ({ spectrumInfo }: { spectrumInfo: SpectrumInfo }) => {
  const bars = toDistributionBars(spectrumInfo.spectrumInfoResDtos);
  const tones = assignBarTones(bars);
  const maxCount = Math.max(...bars.map((bar) => bar.count), 0);

  return (
    <div className="mt-[41px] w-[540px]">
      <h3 className="text-heading-xs text-text-subtle h-6 font-bold">
        받은 평가 분포({spectrumInfo.totalCount}명 응답)
      </h3>

      <div className="mx-auto mt-4 flex w-[513px] items-end justify-between" style={{ height: CHART_TOTAL_HEIGHT_PX }}>
        {bars.map((bar, index) => (
          <div key={bar.label} className="flex w-[61px] flex-col items-center">
            <span className="text-body-xs text-text-subtle flex h-[18px] shrink-0 items-center justify-center text-center font-medium">
              {bar.count}명
            </span>
            <div
              className={cn('w-[50px] shrink-0 rounded-t', barToneBgClasses[tones[index]])}
              style={{ height: `${scaleBarHeight(bar.count, maxCount)}px` }}
            />
            <div className="text-body-xs text-text-subtle mt-2 flex h-9 shrink-0 items-start justify-center text-center font-medium break-keep whitespace-pre-line">
              {bar.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
