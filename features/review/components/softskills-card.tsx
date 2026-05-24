import { cn } from '@/shared/lib/cn';

type DistributionBarTone = 'accent' | 'light' | 'gray' | 'strong';

export type SoftSkillsDistributionBar = {
  label: string;
  count: number;
  tone?: DistributionBarTone;
};

type SoftSkillsCardProps = {
  title?: string;
  distributionBars?: SoftSkillsDistributionBar[];
  showDistribution?: boolean; // 전체 탭: true(스펙트럼+분포 차트) / 프로젝트별: false(스펙트럼만)
};

const spectrumRows = [
  { left: '서포트형', right: '리드형', markerLeft: '20%' },
  { left: '빠른 작업 속도 중시', right: '천천히 신중한 고민 중시', markerLeft: '40%' },
  { left: '상황별 유연한 대처', right: '철저한 계획 기반 실행', markerLeft: '40%' },
  { left: '냉철한 결과 지향', right: '따뜻한 관계 지향', markerLeft: '100%' },
];

const defaultDistributionBars: SoftSkillsDistributionBar[] = [
  { label: '서포트형', count: 5 },
  { label: '리드형', count: 1 },
  { label: '빠른 작업\n속도 중시', count: 4 },
  { label: '천천히 신중\n한 고민 중시', count: 2 },
  { label: '상황별\n유연한 대처', count: 4 },
  { label: '철저한 계획\n기반 실행', count: 2 },
  { label: '냉철한\n결과 지향', count: 0 },
  { label: '따뜻한\n관계 지향', count: 6 },
];

const barToneBgClasses: Record<DistributionBarTone, string> = {
  strong: 'bg-(--color-graphic-yellow)',
  accent: 'bg-(--color-graphic-yellow-subtle)',
  light: 'bg-(--color-graphic-yellow-subtler)',
  gray: 'bg-(--color-gray-300)',
};

const BAR_HEIGHT_MIN_PX = 1;

const STACK_COUNT_AND_BAR_TOTAL_PX = 198;

const COUNT_TEXT_HEIGHT = 18;
const COUNT_TO_BAR_GAP = 0;

const BAR_HEIGHT_MAX_PX = STACK_COUNT_AND_BAR_TOTAL_PX - COUNT_TEXT_HEIGHT - COUNT_TO_BAR_GAP;

const LABEL_GAP = 8;
const LABEL_HEIGHT = 36;

const CHART_TOTAL_HEIGHT = STACK_COUNT_AND_BAR_TOTAL_PX + LABEL_GAP + LABEL_HEIGHT;

const spectrumTrackWidthPx = 286;

const spectrumVerticalDashPercents = [20, 40, 60, 80] as const;

const getBarHeight = (count: number, maxDistributionCount: number): number => {
  if (count <= 0 || maxDistributionCount <= 0) {
    return BAR_HEIGHT_MIN_PX;
  }

  const ratio = count / maxDistributionCount;

  return Math.round(BAR_HEIGHT_MIN_PX + ratio * (BAR_HEIGHT_MAX_PX - BAR_HEIGHT_MIN_PX));
};

const getTopBarTones = (distributionBars: SoftSkillsDistributionBar[]): DistributionBarTone[] => {
  const rankTones: DistributionBarTone[] = ['strong', 'accent', 'light'];
  const uniqueCounts = Array.from(new Set(distributionBars.map((bar) => bar.count))).sort((a, b) => b - a);

  const toneByCount = new Map<number, DistributionBarTone>();

  uniqueCounts.slice(0, rankTones.length).forEach((count, index) => {
    toneByCount.set(count, rankTones[index]);
  });

  return distributionBars.map((bar) => toneByCount.get(bar.count) ?? 'gray');
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

export const SoftSkillsCard = ({
  title = '소프트 스킬 스펙트럼',
  distributionBars = defaultDistributionBars,
  showDistribution = true,
}: SoftSkillsCardProps) => {
  const maxDistributionCount = Math.max(...distributionBars.map((bar) => bar.count), 0);
  const hasDistributionData = showDistribution && distributionBars.some((bar) => bar.count > 0);
  const distributionBarTones = getTopBarTones(distributionBars);

  return (
    <section
      className={cn(
        'border-border-gray w-[588px] overflow-hidden rounded-2xl border bg-white p-6',
        hasDistributionData ? 'h-[652px]' : 'h-auto',
      )}
    >
      <h2 className="text-heading-base h-6 leading-6 font-bold text-black">{title}</h2>

      <div className="mt-7 w-[540px]">
        <h3 className="text-heading-xs text-text-subtle h-6 leading-[150%] font-bold">평균 지표</h3>

        <div className="mt-3 flex h-[136px] items-start">
          <div className="flex h-[136px] w-[93px] flex-col gap-2">
            {spectrumRows.map((row) => (
              <p
                key={`${row.left}-left`}
                className="text-body-xs text-text-subtle flex h-7 items-center leading-[150%] font-medium"
              >
                {row.left}
              </p>
            ))}
          </div>

          <div className="relative mx-6 flex h-[136px] w-[286px] flex-col gap-2">
            <SpectrumVerticalDashOverlay widthPx={spectrumTrackWidthPx} />

            {spectrumRows.map((row) => (
              <div key={`${row.left}-${row.right}`} className="relative z-10 h-7">
                <div className="absolute top-1/2 left-0 z-10 h-1.5 w-full -translate-y-1/2 rounded-full bg-(--color-gray-300)" />

                <div
                  aria-hidden
                  className="border-border-gray-darker bg-bg-white absolute top-1/2 z-20 box-border size-4 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border shadow-sm"
                  style={{ left: row.markerLeft }}
                />
              </div>
            ))}
          </div>

          <div className="flex h-[136px] w-[113px] flex-col gap-2">
            {spectrumRows.map((row) => (
              <p
                key={`${row.right}-right`}
                className="text-body-xs text-text-subtle flex h-7 items-center justify-end leading-[150%] font-medium"
              >
                {row.right}
              </p>
            ))}
          </div>
        </div>
      </div>

      {!!hasDistributionData && (
        <div className="mt-[41px] w-[540px]">
          <h3 className="text-heading-xs text-text-subtle h-6 leading-[150%] font-bold">받은 평가 분포(6명 응답)</h3>

          <div className="mx-auto mt-4 flex w-[513px] items-end justify-between" style={{ height: CHART_TOTAL_HEIGHT }}>
            {distributionBars.map((bar, index) => (
              <div key={bar.label} className="flex w-[61px] flex-col items-center">
                <span className="text-body-xs text-text-subtle flex h-[18px] shrink-0 items-center justify-center text-center leading-[150%] font-medium">
                  {bar.count}명
                </span>

                <div
                  className={cn('w-[50px] shrink-0 rounded-t', barToneBgClasses[distributionBarTones[index]])}
                  style={{
                    height: `${getBarHeight(bar.count, maxDistributionCount)}px`,
                  }}
                />

                <div className="text-body-xs text-text-subtle mt-2 flex h-9 shrink-0 items-start justify-center text-center leading-[150%] font-medium break-keep whitespace-pre-line">
                  {bar.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-detail-base text-text-disabled mt-7 h-6 w-[540px] leading-[150%] font-normal">
        * 지표는 동료들의 평가를 기반으로 자동 산출됩니다.
      </p>
    </section>
  );
};
