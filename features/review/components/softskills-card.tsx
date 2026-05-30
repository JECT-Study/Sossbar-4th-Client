'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { cn } from '@/shared/lib/cn';

import type { SpectrumAxisInfo, SpectrumInfo } from '../types/spectrum';

import { useSpectrum } from '../api/queries';

type DistributionBarTone = 'first' | 'second' | 'third' | 'none';

type SoftSkillsCardProps = {
  userId: number;
  projectId?: number;
  showDistribution?: boolean; // 전체 탭: true(스펙트럼+분포 차트) / 프로젝트별: false(스펙트럼만)
};

// 백엔드 API 요청 후 수정
const spectrumRows = [
  { left: '서포트형', right: '리드형' },
  { left: '빠른 작업 속도 중시', right: '천천히 신중한 고민 중시' },
  { left: '상황별 유연한 대처', right: '철저한 계획 기반 실행' },
  { left: '냉철한 결과 지향', right: '따뜻한 관계 지향' },
];

const barToneBgClasses: Record<DistributionBarTone, string> = {
  first: 'bg-graphic-yellow',
  second: 'bg-graphic-yellow-subtle',
  third: 'bg-graphic-yellow-subtler',
  none: 'bg-gray-300',
};

const BAR_HEIGHT_MIN_PX = 1;

const STACK_COUNT_AND_BAR_TOTAL_PX = 198;

const COUNT_TEXT_HEIGHT = 18;

const BAR_HEIGHT_MAX_PX = STACK_COUNT_AND_BAR_TOTAL_PX - COUNT_TEXT_HEIGHT;

const LABEL_GAP = 8;
const LABEL_HEIGHT = 36;

const CHART_TOTAL_HEIGHT = STACK_COUNT_AND_BAR_TOTAL_PX + LABEL_GAP + LABEL_HEIGHT;

const spectrumTrackWidthPx = 286;

const spectrumVerticalDashPercents = [20, 40, 60, 80] as const;

// 구 버전(0–100 스케일)으로 저장된 데이터를 신 버전(1–6)으로 변환
const normalizeStrength = (v: number): number => {
  if (v > 6) {
    return Math.max(1, Math.min(6, Math.round(v / 20) + 1));
  }
  return Math.round(v);
};

// averageStrength 1–6 → 0%–100% (strength 1 = leftmost, 6 = rightmost)
const getMarkerLeft = (averageStrength: number): string => `${((normalizeStrength(averageStrength) - 1) / 5) * 100}%`;

const getDistributionBars = (spectrumInfo: SpectrumAxisInfo[]) =>
  spectrumInfo.flatMap((item, index) => {
    const row = spectrumRows[index];

    return [
      { label: row.left, count: item.leftStrengthCount },
      { label: row.right, count: item.rightStrengthCount },
    ];
  });

const getBarHeight = (count: number, maxDistributionCount: number): number => {
  if (count <= 0 || maxDistributionCount <= 0) {
    return BAR_HEIGHT_MIN_PX;
  }

  const ratio = count / maxDistributionCount;

  return Math.round(BAR_HEIGHT_MIN_PX + ratio * (BAR_HEIGHT_MAX_PX - BAR_HEIGHT_MIN_PX));
};

const getTopBarTones = (distributionBars: { count: number }[]): DistributionBarTone[] => {
  const rankTones: DistributionBarTone[] = ['first', 'second', 'third'];
  const topCounts = Array.from(new Set(distributionBars.map((bar) => bar.count)))
    .filter((count) => count > 0)
    .sort((a, b) => b - a)
    .slice(0, rankTones.length);

  return distributionBars.map((bar) => {
    const rank = topCounts.indexOf(bar.count);
    return rank >= 0 ? rankTones[rank] : 'none';
  });
};

const SpectrumVerticalDashOverlay = ({ widthPx }: { widthPx: number }) => (
  <svg aria-hidden className="pointer-events-none absolute top-0 left-0 select-none" height={136} width={widthPx}>
    <g stroke="var(--color-border-gray)" strokeLinecap="round" strokeWidth={1} vectorEffect="non-scaling-stroke">
      {spectrumVerticalDashPercents.map((pct) => {
        const x = (widthPx * pct) / 100;

        return <line key={pct} strokeDasharray="2 6" x1={x} x2={x} y1={0} y2={136} />;
      })}
    </g>
  </svg>
);

const SoftSkillsSpectrum = ({ spectrumInfo }: { spectrumInfo: SpectrumInfo }) => (
  <div className="w-fill mt-7">
    <h3 className="text-heading-xs text-text-subtle h-6 font-bold">평균 지표</h3>

    <div className="mt-3 flex h-[136px] items-start">
      <div className="flex h-[136px] w-[93px] flex-col gap-2">
        {spectrumRows.map((row) => (
          <p key={`${row.left}-left`} className="text-body-xs text-text-subtle flex h-7 items-center font-medium">
            {row.left}
          </p>
        ))}
      </div>

      <div className="relative mx-6 flex h-[136px] w-[286px] flex-col gap-2">
        <SpectrumVerticalDashOverlay widthPx={spectrumTrackWidthPx} />

        {(spectrumInfo.spectrumInfoResDtos ?? []).map((axis) => (
          <div key={axis.axisName} className="relative z-10 h-7">
            <div className="absolute top-1/2 left-0 z-10 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-300" />

            <div
              aria-hidden
              className="border-border-gray-darker bg-bg-white absolute top-1/2 z-20 box-border size-4 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border shadow-sm"
              style={{ left: getMarkerLeft(axis.averageStrength) }}
            />
          </div>
        ))}
      </div>

      <div className="flex h-[136px] w-[113px] flex-col gap-2">
        {spectrumRows.map((row) => (
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

const SoftSkillsDistribution = ({ spectrumInfo }: { spectrumInfo: SpectrumInfo }) => {
  const bars = getDistributionBars(spectrumInfo.spectrumInfoResDtos);
  const tones = getTopBarTones(bars);
  const maxCount = Math.max(...bars.map((bar) => bar.count), 0);

  return (
    <div className="mt-[41px] w-[540px]">
      <h3 className="text-heading-xs text-text-subtle h-6 font-bold">
        받은 평가 분포({spectrumInfo.totalCount}명 응답)
      </h3>

      <div className="mx-auto mt-4 flex w-[513px] items-end justify-between" style={{ height: CHART_TOTAL_HEIGHT }}>
        {bars.map((bar, index) => (
          <div key={bar.label} className="flex w-[61px] flex-col items-center">
            <span className="text-body-xs text-text-subtle flex h-[18px] shrink-0 items-center justify-center text-center font-medium">
              {bar.count}명
            </span>
            <div
              className={cn('w-[50px] shrink-0 rounded-t', barToneBgClasses[tones[index]])}
              style={{ height: `${getBarHeight(bar.count, maxCount)}px` }}
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

export const SoftSkillsCard = ({ userId, projectId, showDistribution = true }: SoftSkillsCardProps) => {
  const { data: spectrumInfo, isPending, isError } = useSpectrum({ userId, projectId });

  return (
    <section
      className={cn(
        'border-border-gray flex w-[588px] flex-col overflow-hidden rounded-2xl border bg-white p-6',
        showDistribution ? 'h-[652px]' : 'h-auto',
      )}
    >
      <h2 className="text-heading-base h-6 leading-6 font-bold text-black">소프트 스킬 스펙트럼</h2>

      {isPending ? <p className="text-body-sm text-text-subtle mt-7">스펙트럼 정보를 불러오는 중...</p> : null}

      {isError ? <p className="text-body-sm text-text-error mt-7">스펙트럼 정보를 불러오지 못했습니다.</p> : null}

      {!isPending && !isError && spectrumInfo ? (
        spectrumInfo.totalCount === 0 ? (
          <EmptyState
            title="받은 후기가 없어요"
            // description={isMyProfile ? '피드백이 쌓이면 나의 협업 스펙트럼이 분석돼요' : undefined}
            // 추후 버튼에 기능 연결 예정
            // action={
            //   isMyProfile ? (
            //     <Button variant="secondary" size="medium">
            //       초대 링크 복사
            //     </Button>
            //   ) : null
            // }
          />
        ) : (
          <>
            <SoftSkillsSpectrum spectrumInfo={spectrumInfo} />
            {!!showDistribution && <SoftSkillsDistribution spectrumInfo={spectrumInfo} />}
            <p className="text-detail-base text-text-disabled mt-7 h-6 font-normal">
              * 지표는 동료들의 평가를 기반으로 자동 산출됩니다.
            </p>
          </>
        )
      ) : null}
    </section>
  );
};
