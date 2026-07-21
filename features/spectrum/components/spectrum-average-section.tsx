import { cn } from '@/shared/lib/cn';

import type { SpectrumInfo } from '../spectrum.types';

import {
  SPECTRUM_LEFT_TRACK_CLASS,
  SPECTRUM_MARKER_CLASS,
  SPECTRUM_RIGHT_TRACK_CLASS,
  SPECTRUM_TRACK_SEGMENT_KEYS,
  spectrumAxisLabels,
} from '../spectrum.constants';
import { toMarkerLeft } from '../spectrum.lib';

interface Props {
  spectrumInfo: SpectrumInfo;
}

export const SpectrumAverageSection = ({ spectrumInfo }: Props) => (
  <div className="w-full">
    <h3 className="text-heading-xs text-text-subtle pb-2 font-bold">평균 지표</h3>

    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[108px_minmax(0,1fr)_max-content] lg:items-center lg:gap-x-4 lg:gap-y-1">
      {(spectrumInfo.spectrumInfoResDtos ?? []).map((axis, index) => {
        const labels = spectrumAxisLabels[index];
        const markerLeft = toMarkerLeft(axis.averageStrength);

        return (
          <div key={axis.axisName} className="flex flex-wrap items-center gap-x-4 gap-y-1 lg:contents">
            <p className="text-body-xs text-text-subtle order-1 shrink-0 font-medium lg:order-none">{labels.left}</p>
            <div className="relative order-3 flex h-7 min-h-7 w-full min-w-0 items-center lg:order-none lg:w-auto">
              <div className="relative h-3 w-full overflow-hidden rounded">
                <div aria-hidden className={cn('absolute inset-y-0 left-0 w-1/2', SPECTRUM_LEFT_TRACK_CLASS)} />
                <div aria-hidden className={cn('absolute inset-y-0 right-0 w-1/2', SPECTRUM_RIGHT_TRACK_CLASS)} />
                <div aria-hidden className="absolute inset-0 grid grid-cols-6">
                  {SPECTRUM_TRACK_SEGMENT_KEYS.map((key, segIndex) => (
                    <span
                      key={key}
                      className={cn(
                        segIndex < SPECTRUM_TRACK_SEGMENT_KEYS.length - 1 && 'border-input-surface border-r-[0.5px]',
                      )}
                    />
                  ))}
                </div>
              </div>
              <div aria-hidden className={SPECTRUM_MARKER_CLASS} style={{ left: markerLeft }} />
            </div>
            <p className="text-body-xs text-text-subtle order-2 ml-auto shrink-0 font-medium whitespace-nowrap lg:order-none lg:ml-0">
              {labels.right}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);
