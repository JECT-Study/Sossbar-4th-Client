'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/shared/components/button';
import { PageContainer } from '@/shared/components/page-container';
import { ApiError } from '@/shared/lib/api/error';

type ErrorPageProps = {
  error: Error;
};

export const ErrorPage = ({ error }: ErrorPageProps) => {
  if (error instanceof ApiError && error.status === 404) {
    notFound();
  }

  return (
    <section className="flex flex-1 flex-col items-center py-[180px]">
      <PageContainer className="flex w-full flex-col items-center gap-4 py-10">
        <h1 className="text-heading-xl text-text-basic text-center font-bold">오류가 발생했어요</h1>
        <p className="text-body-xl text-text-subtle text-center font-medium">잠시 후 다시 시도해 주세요.</p>
        <Button asChild variant="primary" size="large" className="mt-6 self-center">
          <Link href="/">홈으로 가기</Link>
        </Button>
      </PageContainer>
    </section>
  );
};

export default ErrorPage;
