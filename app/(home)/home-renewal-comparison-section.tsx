import Image from 'next/image';

import { CheckFilledIcon } from '@/shared/assets/icons';
import { PageContainer } from '@/shared/components/page-container';
import { cn } from '@/shared/lib/cn';

import { HomeSectionHeader } from './home-section-header';

type CellValue = 'check' | 'circle' | 'x' | string;

type ComparisonRow = {
  feature: string;
  github: CellValue;
  portfolio: CellValue;
  sossbar: CellValue;
};

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: '기술 역량 증명', github: 'circle', portfolio: 'circle', sossbar: 'check' },
  { feature: '협업 스타일 시각화', github: 'x', portfolio: 'x', sossbar: 'check' },
  { feature: '동료 피드백 기반', github: 'x', portfolio: '자기 서술', sossbar: 'check' },
  { feature: '소프트스킬 데이터화', github: 'x', portfolio: 'x', sossbar: 'check' },
  { feature: '외부 공유', github: '링크', portfolio: 'PDF/노션', sossbar: '전용 URL' },
];

const TABLE_GRID_CLASS = 'grid grid-cols-[188px_284px_284px_284px]';

const ComparisonCellContent = ({ value }: { value: CellValue }) => {
  if (value === 'check') {
    return <CheckFilledIcon aria-hidden className="text-element-primary size-4" />;
  }

  if (value === 'circle') {
    return (
      <Image
        src="/home-renewal/comparison-circle-outline.svg"
        alt=""
        width={20}
        height={20}
        className="size-5"
        aria-hidden
      />
    );
  }

  if (value === 'x') {
    return (
      <Image src="/home-renewal/comparison-x-icon-1.svg" alt="" width={16} height={16} className="size-4" aria-hidden />
    );
  }

  return <span className="text-text-subtle text-body-sm font-medium">{value}</span>;
};

const ComparisonDataCell = ({ value, highlighted }: { value: CellValue; highlighted?: boolean }) => (
  <div
    className={cn(
      'flex h-12 items-center justify-center px-2 py-3.5',
      highlighted ? 'bg-primary-50/50' : 'bg-surface-white',
    )}
  >
    <ComparisonCellContent value={value} />
  </div>
);

export const HomeRenewalComparisonSection = () => {
  return (
    <section className="relative h-[800px] overflow-hidden bg-white">
      <PageContainer className="relative z-10 flex h-full flex-col items-center justify-center">
        <HomeSectionHeader
          badge="차별성"
          heading="소스바에서 하드스킬과 소프트스킬을 함께!"
          description="기술은 증명할 수 있어도, 협업 방식과 신뢰는 동료의 목소리로만 보여줄 수 있습니다."
        />

        <div className="mt-10 flex w-full justify-center py-10">
          <div className="w-full max-w-[1039px] overflow-x-auto">
            <div className="min-w-[1039px] overflow-hidden rounded-2xl shadow-[0px_8px_12px_rgba(0,0,0,0.1)]">
              <div className={TABLE_GRID_CLASS}>
                <div aria-hidden className="bg-element-gray-light h-[62px] shrink-0 border-b border-[#e5e7eb]" />
                <div className="bg-element-gray-light flex h-[62px] items-center justify-center border-b border-[#e5e7eb] px-2 pt-4 pb-[16.5px]">
                  <span className="text-text-basic text-body-base leading-6 font-bold">GitHub</span>
                </div>
                <div className="bg-element-gray-light flex h-[62px] items-center justify-center border-b border-[#e5e7eb] px-2 pt-4 pb-[16.5px]">
                  <span className="text-text-basic text-body-base leading-6 font-bold">포트폴리오</span>
                </div>
                <div className="bg-primary-50 flex h-[62px] items-center justify-center border-b border-[#e5e7eb] px-2 pt-4 pb-[16.5px]">
                  <Image
                    src="/home-renewal/comparison-sossbar-logo.png"
                    alt="Sossbar"
                    width={88}
                    height={20}
                    className="h-5 w-[88px] object-contain"
                  />
                </div>

                {COMPARISON_ROWS.map((row) => (
                  <div key={row.feature} className="contents">
                    <div className="bg-surface-white flex h-12 items-center px-4 py-3.5">
                      <span className="text-text-basic text-body-sm leading-[21px] font-bold whitespace-nowrap">
                        {row.feature}
                      </span>
                    </div>
                    <ComparisonDataCell value={row.github} />
                    <ComparisonDataCell value={row.portfolio} />
                    <ComparisonDataCell value={row.sossbar} highlighted />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};
