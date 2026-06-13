import Image from 'next/image';

import { CheckFilledIcon, XIcon } from '@/shared/assets/icons';
import { PageContainer } from '@/shared/components/page-container';
import { cn } from '@/shared/lib/cn';

import { HomeSectionHeader } from './home-section-header';

type ComparisonCellValue =
  | { type: 'yes' }
  | { type: 'no' }
  | { type: 'partial'; label: string }
  | { type: 'text'; label: string };

type ComparisonRow = {
  label: string;
  github: ComparisonCellValue;
  portfolio: ComparisonCellValue;
  sossbar: ComparisonCellValue;
};

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: '기술 역량 증명',
    github: { type: 'yes' },
    portfolio: { type: 'yes' },
    sossbar: { type: 'yes' },
  },
  {
    label: '협업 스타일 시각화',
    github: { type: 'no' },
    portfolio: { type: 'no' },
    sossbar: { type: 'yes' },
  },
  {
    label: '동료 피드백 기반',
    github: { type: 'no' },
    portfolio: { type: 'partial', label: '자기 서술' },
    sossbar: { type: 'yes' },
  },
  {
    label: '소프트스킬 데이터화',
    github: { type: 'no' },
    portfolio: { type: 'no' },
    sossbar: { type: 'yes' },
  },
  {
    label: '외부 공유',
    github: { type: 'text', label: '링크' },
    portfolio: { type: 'text', label: 'PDF/노션' },
    sossbar: { type: 'text', label: '전용 URL' },
  },
];

const COLUMN_HEADERS = [
  { key: 'github', label: 'GitHub', highlighted: false },
  { key: 'portfolio', label: '포트폴리오', highlighted: false },
  { key: 'sossbar', label: 'Sossbar', highlighted: true },
] as const;

const ComparisonStatusCell = ({ value }: { value: ComparisonCellValue }) => {
  if (value.type === 'yes') {
    return (
      <span className="text-icon-primary inline-flex size-5 items-center justify-center">
        <CheckFilledIcon className="size-4" aria-hidden />
        <span className="sr-only">가능</span>
      </span>
    );
  }

  if (value.type === 'no') {
    return (
      <span className="text-icon-gray-light inline-flex size-5 items-center justify-center">
        <XIcon className="size-4" aria-hidden />
        <span className="sr-only">불가</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'text-body-sm text-center leading-5 font-normal',
        value.type === 'partial' ? 'text-text-subtle' : 'text-text-basic',
      )}
    >
      {value.label}
    </span>
  );
};

export const HomeComparisonSection = () => {
  return (
    <section id="home-comparison-section" className="bg-surface-gray-subtler">
      <PageContainer className="flex min-h-[800px] w-full items-center py-20">
        <div className="flex w-full flex-col items-center self-center">
          <HomeSectionHeader
            badge="왜 소스바인가"
            heading="GitHub와 포트폴리오만으로는 부족합니다"
            description="기술은 증명할 수 있어도, 협업 방식과 신뢰는 동료의 목소리로만 보여줄 수 있습니다."
          />

          <div className="mt-10 flex w-full max-w-[1200px] items-center justify-center">
            <div className="border-border-gray-light bg-surface-white w-full min-w-0 overflow-hidden rounded-2xl border shadow-[0px_8px_24px_0px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,0.9fr))]">
                <div className="bg-surface-gray-subtler border-border-gray-light border-b px-4 py-4" aria-hidden />
                {COLUMN_HEADERS.map((column) => (
                  <div
                    key={column.key}
                    className={cn(
                      'border-border-gray-light flex flex-col items-center justify-center gap-1.5 border-b px-2 py-4 text-center',
                      column.highlighted ? 'bg-surface-primary-subtler' : 'bg-surface-gray-subtler',
                    )}
                  >
                    {column.highlighted ? (
                      <Image src="/Sossbar_logo.svg" alt="" width={88} height={20} className="h-5 w-[5.5rem]" />
                    ) : null}
                    <span
                      className={cn(
                        'text-body-base font-bold',
                        column.highlighted ? 'text-element-primary' : 'text-text-basic',
                      )}
                    >
                      {column.label}
                    </span>
                    {column.highlighted ? (
                      <span className="bg-button-primary-fill text-text-basic-inverse rounded-full px-2 py-0.5 text-[12px] leading-none font-normal">
                        추천
                      </span>
                    ) : null}
                  </div>
                ))}

                {COMPARISON_ROWS.map((row, rowIndex) => {
                  const isLastRow = rowIndex === COMPARISON_ROWS.length - 1;

                  return (
                    <div key={row.label} className="contents">
                      <div
                        className={cn(
                          'border-border-gray-light flex items-center px-4 py-3.5',
                          !isLastRow && 'border-b',
                        )}
                      >
                        <span className="text-text-basic text-body-sm font-bold">{row.label}</span>
                      </div>
                      <div
                        className={cn(
                          'border-border-gray-light flex items-center justify-center px-2 py-3.5',
                          !isLastRow && 'border-b',
                        )}
                      >
                        <ComparisonStatusCell value={row.github} />
                      </div>
                      <div
                        className={cn(
                          'border-border-gray-light flex items-center justify-center px-2 py-3.5',
                          !isLastRow && 'border-b',
                        )}
                      >
                        <ComparisonStatusCell value={row.portfolio} />
                      </div>
                      <div
                        className={cn(
                          'bg-surface-primary-subtler/50 flex items-center justify-center px-2 py-3.5',
                          !isLastRow && 'border-border-gray-light border-b',
                        )}
                      >
                        <ComparisonStatusCell value={row.sossbar} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};
