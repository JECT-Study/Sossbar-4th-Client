import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/shared/components/button/button';
import { PageContainer } from '@/shared/components/page-container';
import { ROUTES } from '@/shared/constants/routes';

export const HomeHeroSection = () => {
  return (
    <PageContainer className="flex justify-center pt-40 pb-64">
      <div className="flex-1">
        <h1 className="text-display-base text-text-basic h-[168px] w-full leading-[1.3] font-bold tracking-[-0.02em]">
          당신의 소프트스킬,
          <br />
          <span className="text-primary-500">&apos;데이터&apos;</span>로 본 적 있나요?
        </h1>

        <p className="text-body-base text-text-subtle mt-4 w-full leading-6 font-normal">
          텍스트로 나열된 스펙으로만 당신이 얼마나 훌륭한 동료인지 보여줄 수 없습니다.
          <br />
          커뮤니케이션 스타일을 증명하고 완벽한 팀의 컬처핏을 찾으세요.
        </p>
        <div className="mt-[40px] flex items-center gap-4">
          <Button asChild variant="primary" size="large">
            <Link href={ROUTES.LOGIN}>프로젝트 시작하기</Link>
          </Button>
          <Button asChild variant="secondary" size="large">
            <Link href={ROUTES.LOGIN}>내 프로필 보기</Link>
          </Button>
        </div>
      </div>

      <div className="relative h-[440px] w-[588px]">
        <div className="relative h-full w-full">
          <Image src="/Margin.svg" alt="Hero visual" fill className="object-contain" priority />
        </div>
      </div>
    </PageContainer>
  );
};
