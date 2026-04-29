type DistributionBarTone = 'accent' | 'light' | 'gray' | 'strong';

export type SoftSkillsDistributionBar = {
  label: string;
  count: number;
  tone: DistributionBarTone;
};

type SoftSkillsProps = {
  title?: string;
  distributionBars?: SoftSkillsDistributionBar[];
};

const spectrumRows = [
  { left: '서포트형', right: '리드형', markerLeft: '20%' },
  { left: '빠른 작업 속도 중시', right: '천천히 신중한 고민 중시', markerLeft: '40%' },
  { left: '상황별 유연한 대처', right: '철저한 계획 기반 실행', markerLeft: '40%' },
  { left: '냉철한 결과 지향', right: '따뜻한 관계 지향', markerLeft: '100%' },
];

const defaultDistributionBars: SoftSkillsDistributionBar[] = [
  { label: '서포트형', count: 5, tone: 'accent' as const },
  { label: '리드형', count: 1, tone: 'gray' as const },
  { label: '빠른 작업\n속도 중시', count: 4, tone: 'light' as const },
  { label: '천천히 신중\n한 고민 중시', count: 2, tone: 'gray' as const },
  { label: '상황별\n유연한 대처', count: 4, tone: 'light' as const },
  { label: '철저한 계획\n기반 실행', count: 2, tone: 'gray' as const },
  { label: '냉철한\n결과 지향', count: 0, tone: 'gray' as const },
  { label: '따뜻한\n관계 지향', count: 6, tone: 'strong' as const },
];

const barToneColors: Record<DistributionBarTone, { min: string; max: string }> = {
  accent: { min: '#FFF3CF', max: '#FFD27A' },
  light: { min: '#FFF9EA', max: '#FFE8BC' },
  gray: { min: '#ECEFF3', max: '#C9CDD3' },
  strong: { min: '#FFE4A6', max: '#FFB22E' },
};

const CHART_TOTAL_HEIGHT = 235;
const COUNT_TEXT_HEIGHT = 18;
const COUNT_TO_BAR_GAP = 6;
const LABEL_GAP = 12;
const LABEL_HEIGHT = 36;
const MIN_BAR_HEIGHT = 15;

const MAX_BAR_HEIGHT = CHART_TOTAL_HEIGHT - COUNT_TEXT_HEIGHT - COUNT_TO_BAR_GAP - LABEL_GAP - LABEL_HEIGHT;

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

const hexToRgb = (hex: string): RgbColor => {
  const normalizedHex = hex.replace('#', '');

  return {
    r: Number.parseInt(normalizedHex.slice(0, 2), 16),
    g: Number.parseInt(normalizedHex.slice(2, 4), 16),
    b: Number.parseInt(normalizedHex.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }: RgbColor): string => {
  const toHex = (value: number) => value.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const mixHexColors = (from: string, to: string, ratio: number): string => {
  const start = hexToRgb(from);
  const end = hexToRgb(to);

  return rgbToHex({
    r: Math.round(start.r + (end.r - start.r) * ratio),
    g: Math.round(start.g + (end.g - start.g) * ratio),
    b: Math.round(start.b + (end.b - start.b) * ratio),
  });
};

const getBarHeight = (count: number, maxDistributionCount: number): number => {
  if (count <= 0) {
    return 1;
  }

  return Math.round((count / maxDistributionCount) * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT) + MIN_BAR_HEIGHT);
};

const getBarColor = (tone: DistributionBarTone, count: number, maxDistributionCount: number): string => {
  const { min, max } = barToneColors[tone];

  if (maxDistributionCount <= 0) {
    return min;
  }

  const ratio = Math.max(0, Math.min(1, count / maxDistributionCount));

  return mixHexColors(min, max, ratio);
};

export const SoftSkills = ({
  title = '소프트 스킬 스펙트럼',
  distributionBars = defaultDistributionBars,
}: SoftSkillsProps) => {
  const maxDistributionCount = Math.max(...distributionBars.map((bar) => bar.count), 0);
  const hasDistributionData = distributionBars.some((bar) => bar.count > 0);

  return (
    <section className="border-border-gray relative h-[652px] w-[588px] overflow-hidden rounded-[16px] border bg-white px-[24px] py-[24px]">
      <div className="absolute top-[24px] left-1/2 h-[24px] w-[540px] -translate-x-1/2 text-left">
        <h2 className="text-heading-sm leading-[24px] font-bold text-black">{title}</h2>
      </div>

      <div className="mt-[52px] w-[540px]">
        <h3 className="text-detail-base text-text-subtle h-[24px] leading-[150%] font-bold">평균 지표</h3>

        <div className="mt-[12px] flex h-[136px] items-start">
          <div className="flex h-[136px] w-[93px] flex-col gap-[8px]">
            {spectrumRows.map((row) => (
              <p
                key={`${row.left}-left`}
                className="text-body-xs text-text-subtle flex h-[28px] items-center leading-[150%] font-medium"
              >
                {row.left}
              </p>
            ))}
          </div>

          <div className="mx-[24px] flex h-[136px] w-[286px] flex-col gap-[8px]">
            {spectrumRows.map((row) => (
              <div key={`${row.left}-${row.right}`} className="relative h-[28px]">
                <div className="absolute top-1/2 left-0 h-[6px] w-full -translate-y-1/2 rounded-full bg-[#D1D5DB]" />

                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-between px-[56px]">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="h-[24px] border-l border-dashed border-[#D8DDE5]" />
                  ))}
                </div>

                <div
                  className="absolute top-1/2 h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1F2937] bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.65)]"
                  style={{ left: row.markerLeft }}
                />
              </div>
            ))}
          </div>

          <div className="flex h-[136px] w-[113px] flex-col gap-[8px]">
            {spectrumRows.map((row) => (
              <p
                key={`${row.right}-right`}
                className="text-body-xs text-text-subtle flex h-[28px] items-center justify-end text-right leading-[150%] font-medium whitespace-nowrap"
              >
                {row.right}
              </p>
            ))}
          </div>
        </div>
      </div>

      {!!hasDistributionData && (
        <div className="mt-[41px] w-[540px]">
          <h3 className="text-heading-sm leading-[30px] font-bold text-[#4B5563]">받은 평가 분포(6명 응답)</h3>

          <div className="mx-auto mt-[16px] flex h-[235px] w-[513px] items-end justify-between">
            {distributionBars.map((bar) => (
              <div key={bar.label} className="flex w-[61px] flex-col items-center">
                <span className="text-body-xs mb-[6px] text-center leading-[150%] font-medium text-[#4B5563]">
                  {bar.count}명
                </span>
                <div
                  className="w-[50px] rounded-t-[4px]"
                  style={{
                    height: `${getBarHeight(bar.count, maxDistributionCount)}px`,
                    backgroundColor: getBarColor(bar.tone, bar.count, maxDistributionCount),
                  }}
                />
                <div className="text-body-xs text-text-subtle mt-[12px] flex h-[36px] items-start justify-center text-center leading-[150%] font-medium break-keep whitespace-pre-line">
                  {bar.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasDistributionData ? (
        <p className="text-detail-base text-text-disabled absolute bottom-[24px] left-1/2 h-[24px] w-[540px] -translate-x-1/2 leading-[150%] font-normal">
          * 지표는 동료들의 평가를 기반으로 자동 산출됩니다.
        </p>
      ) : (
        <p className="text-detail-base text-text-disabled mt-[28px] h-[24px] w-[540px] leading-[150%] font-normal">
          * 지표는 동료들의 평가를 기반으로 자동 산출됩니다.
        </p>
      )}
    </section>
  );
};
