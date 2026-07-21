import { cn } from '@/shared/lib/cn';

import type { SpectrumInfo } from '../spectrum.types';

import { DISTRIBUTION_LEFT_BAR_CLASS, DISTRIBUTION_RIGHT_BAR_CLASS } from '../spectrum.constants';
import { scaleBarHeight, toDistributionBars } from '../spectrum.lib';

interface Props {
  spectrumInfo: SpectrumInfo;
}

export const SpectrumDistributionSection = ({ spectrumInfo }: Props) => {
  const bars = toDistributionBars(spectrumInfo.spectrumInfoResDtos);
  const maxCount = Math.max(...bars.map((bar) => bar.count), 0);

  return (
    <div className="mt-6 w-full">
      <h3 className="text-heading-xs text-text-subtle pb-2 font-bold">평가 분포</h3>

      <div className="flex w-full items-end justify-center gap-2 lg:h-[242px]">
        {bars.map((bar, index) => {
          const isLeftTrait = index % 2 === 0;
          const barHeightPx = bar.count === 0 ? 1 : scaleBarHeight(bar.count, maxCount);

          return (
            <div key={bar.label} className="flex min-w-0 flex-1 flex-col items-center lg:w-[58.625px] lg:flex-none">
              <span className="text-detail-xs text-text-subtle flex h-[18px] shrink-0 items-center justify-center text-center font-medium">
                {bar.count}명
              </span>
              <div
                className={cn(
                  'w-full shrink-0 rounded-tl-[12px] rounded-tr-[12px] rounded-br rounded-bl-[4px] lg:w-10',
                  isLeftTrait ? DISTRIBUTION_LEFT_BAR_CLASS : DISTRIBUTION_RIGHT_BAR_CLASS,
                )}
                style={{ height: `${barHeightPx}px` }}
              />
              <div className="text-detail-xs text-text-subtle mt-2 flex h-auto min-h-9 shrink-0 items-start justify-center text-center font-medium break-keep whitespace-pre-line lg:h-9">
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
