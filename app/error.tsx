'use client';

import { Button } from '@/shared/components/button';
import { PageContainer } from '@/shared/components/page-container';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error = ({ reset }: ErrorProps) => (
  <PageContainer className="mt-15.5 flex flex-col items-center gap-4 text-center">
    <h2 className="text-heading-base text-text-basic font-bold">페이지를 불러올 수 없습니다.</h2>
    <p className="text-body-base text-text-subtle">잠시 후 다시 시도해 주세요.</p>
    <Button type="button" variant="secondary" size="medium" onClick={reset}>
      다시 시도
    </Button>
  </PageContainer>
);

export default Error;
