import { Button } from '@/shared/components/button';

import type { FallbackProps } from 'react-error-boundary';

export const ProfileSectionError = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <section className="mt-15.5 mb-8 flex min-h-[104px] w-full items-center justify-between gap-4">
      <p className="text-body-base text-text-basic">프로필 정보를 불러오지 못했습니다.</p>
      <Button type="button" variant="secondary" size="medium" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </section>
  );
};
