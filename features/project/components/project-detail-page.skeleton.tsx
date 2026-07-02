import type { ReactNode } from 'react';

import { PageContainer } from '@/shared/components/page-container';
import { cn } from '@/shared/lib/cn';

const MEMBER_CHIP_KEYS = ['member-1', 'member-2', 'member-3', 'member-4'];

interface InfoRowConfig {
  key: string;
  labelWidth: string;
  value: ReactNode;
  align: 'center' | 'start';
}

const INFO_ROWS: InfoRowConfig[] = [
  {
    key: 'project-name',
    labelWidth: 'w-16',
    value: <div className="bg-action-gray-light h-6 w-1/2 animate-pulse rounded-sm" />,
    align: 'center',
  },
  {
    key: 'host',
    labelWidth: 'w-12',
    value: <div className="bg-action-gray-light h-6 w-1/3 animate-pulse rounded-sm" />,
    align: 'center',
  },
  {
    key: 'date',
    labelWidth: 'w-10',
    value: <div className="bg-action-gray-light h-6 w-2/5 animate-pulse rounded-sm" />,
    align: 'center',
  },
  {
    key: 'image',
    labelWidth: 'w-24',
    value: <div className="bg-action-gray-light size-25 animate-pulse rounded-2xl" />,
    align: 'start',
  },
  {
    key: 'url',
    labelWidth: 'w-8',
    value: <div className="bg-action-gray-light h-6 w-1/2 animate-pulse rounded-sm" />,
    align: 'center',
  },
];

const SectionCardSkeleton = ({ titleWidth, children }: { titleWidth: string; children: ReactNode }) => (
  <div className="border-border-gray bg-surface-white flex justify-between rounded-2xl border p-8">
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className={cn('bg-action-gray-light h-7 animate-pulse rounded-md', titleWidth)} />
        <div className="bg-action-gray-light h-9 w-14 shrink-0 animate-pulse rounded-md" />
      </div>
      {children}
    </div>
  </div>
);

const InfoRowSkeleton = ({ labelWidth, value, align }: Omit<InfoRowConfig, 'key'>) => (
  <div className={cn('flex gap-[60px]', align === 'center' ? 'items-center' : 'items-start')}>
    <div className="w-30 shrink-0">
      <div className={cn('bg-action-gray-light h-6 animate-pulse rounded-sm', labelWidth)} />
    </div>
    <div className="min-w-0 flex-1">{value}</div>
  </div>
);

export const ProjectDetailPageSkeleton = () => (
  <div aria-hidden>
    <PageContainer className="mb-20 flex flex-col gap-8">
      {/* Heading */}
      <header className="border-border-gray-light flex items-end justify-between border-b-[3px] pt-15.5 pb-8">
        <div className="flex flex-col gap-2">
          <div className="bg-action-gray-light h-9 w-40 animate-pulse rounded-md" />
          <div className="bg-action-gray-light h-6 w-96 animate-pulse rounded-sm" />
        </div>
      </header>

      {/* 프로젝트 정보 카드 */}
      <SectionCardSkeleton titleWidth="w-28">
        <div className="flex flex-col gap-8">
          {INFO_ROWS.map(({ key, ...row }) => (
            <InfoRowSkeleton key={key} {...row} />
          ))}
        </div>
      </SectionCardSkeleton>

      {/* 팀원 정보 카드 */}
      <SectionCardSkeleton titleWidth="w-24">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-[60px]">
            <div className="w-30 shrink-0">
              <div className="bg-action-gray-light h-6 w-20 animate-pulse rounded-sm" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {MEMBER_CHIP_KEYS.map((key) => (
                <div key={key} className="bg-action-gray-light h-12.25 w-40 animate-pulse rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </SectionCardSkeleton>
    </PageContainer>
  </div>
);
