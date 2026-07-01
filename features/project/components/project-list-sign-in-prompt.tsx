import Link from 'next/link';

import { Button } from '@/shared/components/button';

export const ProjectListSignInPrompt = () => (
  <div className="border-divider-gray-light flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-12 text-center">
    <p className="text-body-base text-text-basic">로그인 후 프로젝트 목록을 불러올 수 있습니다.</p>
    {process.env.NODE_ENV === 'development' ? (
      <Button type="button" variant="secondary" size="medium" asChild>
        <Link href="/login/test">테스트 계정으로 로그인</Link>
      </Button>
    ) : null}
  </div>
);
