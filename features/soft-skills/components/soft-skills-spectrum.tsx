import type { SpectrumInfo } from '../soft-skills.types';

import { spectrumAxisLabels } from '../constants/spectrum-axis-labels';
import { toMarkerLeft } from '../utils/to-marker-left';

/** 스펙트럼 트랙(마커가 이동하는 가로 바) 너비(px) */
const SPECTRUM_TRACK_WIDTH_PX = 286;

/** 4개 축 × 행 높이(h-7 + gap-2)에 맞춘 트랙 전체 높이(px) */
const SPECTRUM_TRACK_HEIGHT_PX = 136;

/** 트랙 위 세로 점선 가이드 위치(%) — 5구간 시각 보조 */
const SPECTRUM_VERTICAL_DASH_PERCENTS = [20, 40, 60, 80] as const;

const SpectrumVerticalDashOverlay = ({ widthPx }: { widthPx: number }) => (
  <svg
    aria-hidden
    className="pointer-events-none absolute top-0 left-0 select-none"
    height={SPECTRUM_TRACK_HEIGHT_PX}
    width={widthPx}
  >
    <g stroke="var(--color-border-gray)" strokeLinecap="round" strokeWidth={1} vectorEffect="non-scaling-stroke">
      {SPECTRUM_VERTICAL_DASH_PERCENTS.map((pct) => {
        const x = (widthPx * pct) / 100;

        return <line key={pct} strokeDasharray="2 6" x1={x} x2={x} y1={0} y2={SPECTRUM_TRACK_HEIGHT_PX} />;
      })}
    </g>
  </svg>
);

interface Props {
  spectrumInfo: SpectrumInfo;
}

export const SoftSkillsSpectrum = ({ spectrumInfo }: Props) => (
  <div className="w-fill mt-7">
    <h3 className="text-heading-xs text-text-subtle h-6 font-bold">평균 지표</h3>

    <div className="mt-3 flex items-start" style={{ height: SPECTRUM_TRACK_HEIGHT_PX }}>
      <div className="flex w-[93px] flex-col gap-2" style={{ height: SPECTRUM_TRACK_HEIGHT_PX }}>
        {spectrumAxisLabels.map((row) => (
          <p key={`${row.left}-left`} className="text-body-xs text-text-subtle flex h-7 items-center font-medium">
            {row.left}
          </p>
        ))}
      </div>

      <div className="relative mx-6 flex w-[286px] flex-col gap-2" style={{ height: SPECTRUM_TRACK_HEIGHT_PX }}>
        <SpectrumVerticalDashOverlay widthPx={SPECTRUM_TRACK_WIDTH_PX} />

        {(spectrumInfo.spectrumInfoResDtos ?? []).map((axis) => (
          <div key={axis.axisName} className="relative z-10 h-7">
            <div className="absolute top-1/2 left-0 z-10 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-300" />

            <div
              aria-hidden
              className="border-border-gray-darker bg-bg-white absolute top-1/2 z-20 box-border size-4 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border shadow-sm"
              style={{ left: toMarkerLeft(axis.averageStrength) }}
            />
          </div>
        ))}
      </div>

      <div className="flex w-[113px] flex-col gap-2" style={{ height: SPECTRUM_TRACK_HEIGHT_PX }}>
        {spectrumAxisLabels.map((row) => (
          <p
            key={`${row.right}-right`}
            className="text-body-xs text-text-subtle flex h-7 items-center justify-end font-medium"
          >
            {row.right}
          </p>
        ))}
      </div>
    </div>
  </div>
);
