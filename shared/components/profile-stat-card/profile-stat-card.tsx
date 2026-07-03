import type { ReactNode } from 'react';

import { InfoIcon } from '@/shared/assets/icons';
import { Tooltip } from '@/shared/components/tooltip';
import { cn } from '@/shared/lib/cn';

interface Props {
  title: string;
  /** 헤더 제목 옆 정보 아이콘 노출 여부 */
  info?: boolean;
  /** 정보 아이콘의 접근성 레이블 겸 hover 툴팁 텍스트 */
  infoLabel?: string;
  /** "1일 전 업데이트" 등 갱신 시각 텍스트. 값이 없으면 노출하지 않음 */
  updatedLabel?: string;
  /** 헤더 우측 컨트롤(정렬, 토글 등) */
  headerAction?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export const ProfileStatCard = ({
  title,
  info = false,
  infoLabel = '도움말',
  updatedLabel,
  headerAction,
  className,
  bodyClassName,
  children,
}: Props) => (
  <section className={cn('border-border-gray flex flex-col overflow-hidden rounded-2xl border bg-white', className)}>
    <header className="bg-surface-gray-subtler flex items-center justify-between px-6 py-5">
      <div className="flex items-center gap-1.5">
        <h2 className="text-heading-sm text-text-basic font-bold">{title}</h2>
        {info ? (
          <Tooltip content={infoLabel}>
            <button
              type="button"
              aria-label={infoLabel}
              className="text-icon-gray-fill inline-flex cursor-default focus-visible:outline-none"
            >
              <InfoIcon aria-hidden className="text-text-subtler size-6" />
            </button>
          </Tooltip>
        ) : null}
      </div>
      {headerAction ??
        (updatedLabel ? <span className="text-detail-sm text-text-subtler font-medium">{updatedLabel}</span> : null)}
    </header>
    <div className={cn('flex min-h-0 flex-1 flex-col px-6 py-6', bodyClassName)}>{children}</div>
  </section>
);
