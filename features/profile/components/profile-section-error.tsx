import { Button } from '@/shared/components/button';

import type { FallbackProps } from 'react-error-boundary';

export const ProfileSectionError = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <section className="border-border-gray-light bg-surface-gray-subtler mt-15.5 mb-8 flex min-h-[104px] w-full flex-col items-center justify-between gap-6 rounded-lg border py-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-heading-sm text-text-basic font-bold">프로필을 불러오지 못했어요.</h2>
        <p className="text-body-base text-text-subtle">연결 상태를 확인한 뒤 다시 시도해 주세요.</p>
      </div>
      <Button type="button" size="medium" onClick={resetErrorBoundary} className="mx-auto w-80">
        다시 시도
      </Button>
    </section>
  );
};
