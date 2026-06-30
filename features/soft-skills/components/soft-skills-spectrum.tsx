import type { SpectrumInfo } from '../types/soft-skills.types';

import { spectrumAxisLabels } from '../constants/spectrum-axis-labels';
import {
  SPECTRUM_LEFT_TRACK_CLASS,
  SPECTRUM_MARKER_CLASS,
  SPECTRUM_RIGHT_TRACK_CLASS,
} from '../constants/spectrum-visual.constants';
import { toMarkerLeft } from '../utils/to-marker-left';

/** 4축 × (h-7 + gap-1) */
const SPECTRUM_TRACK_HEIGHT_PX = 136;

interface Props {
  spectrumInfo: SpectrumInfo;
}

export const SoftSkillsSpectrum = ({ spectrumInfo }: Props) => (
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
            <div key={axis.axisName} className="relative h-7 min-h-7">
              <div className="absolute top-1/2 right-0 left-0 h-2 -translate-y-1/2">
                <div
                  aria-hidden
                  className={`absolute top-0 left-0 h-full rounded-l-[2px] ${SPECTRUM_LEFT_TRACK_CLASS}`}
                  style={{ width: markerLeft }}
                />
                <div
                  aria-hidden
                  className={`absolute top-0 h-full rounded-r-[2px] ${SPECTRUM_RIGHT_TRACK_CLASS}`}
                  style={{ left: markerLeft, width: `calc(100% - ${markerLeft})` }}
                />
                <div aria-hidden className={SPECTRUM_MARKER_CLASS} style={{ left: markerLeft }} />
              </div>
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
