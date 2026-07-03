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

/** 4축 × (h-7 + gap-1) */
const SPECTRUM_TRACK_HEIGHT_PX = 136;

interface Props {
  spectrumInfo: SpectrumInfo;
}

export const SpectrumAverageSection = ({ spectrumInfo }: Props) => (
  <div className="w-full">
    <h3 className="text-heading-xs text-text-subtle pb-2 font-bold">평균 지표</h3>

    <div className="flex items-center gap-4" style={{ height: SPECTRUM_TRACK_HEIGHT_PX }}>
      <div className="flex w-[108px] shrink-0 flex-col gap-1" style={{ height: SPECTRUM_TRACK_HEIGHT_PX }}>
        {spectrumAxisLabels.map((row) => (
          <p key={`${row.left}-left`} className="text-body-xs text-text-subtle flex h-7 items-center font-medium">
            {row.left}
          </p>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1" style={{ height: SPECTRUM_TRACK_HEIGHT_PX }}>
        {(spectrumInfo.spectrumInfoResDtos ?? []).map((axis) => {
          const markerLeft = toMarkerLeft(axis.averageStrength);

          return (
            <div key={axis.axisName} className="relative flex h-7 min-h-7 items-center">
              <div className="relative h-3 w-full overflow-hidden rounded">
                <div aria-hidden className={cn('absolute inset-y-0 left-0 w-1/2', SPECTRUM_LEFT_TRACK_CLASS)} />
                <div aria-hidden className={cn('absolute inset-y-0 right-0 w-1/2', SPECTRUM_RIGHT_TRACK_CLASS)} />
                <div aria-hidden className="absolute inset-0 grid grid-cols-6">
                  {SPECTRUM_TRACK_SEGMENT_KEYS.map((key, index) => (
                    <span
                      key={key}
                      className={cn(
                        index < SPECTRUM_TRACK_SEGMENT_KEYS.length - 1 && 'border-input-surface border-r-[0.5px]',
                      )}
                    />
                  ))}
                </div>
              </div>
              <div aria-hidden className={SPECTRUM_MARKER_CLASS} style={{ left: markerLeft }} />
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 flex-col gap-1" style={{ height: SPECTRUM_TRACK_HEIGHT_PX }}>
        {spectrumAxisLabels.map((row) => (
          <p
            key={`${row.right}-right`}
            className="text-body-xs text-text-subtle flex h-7 items-center font-medium whitespace-nowrap"
          >
            {row.right}
          </p>
        ))}
      </div>
    </div>
  </div>
);
