import Image from 'next/image';
import { Suspense } from 'react';

import { Button } from '@/shared/components/button/button';
import { PageContainer } from '@/shared/components/page-container';
import { ProtectedLink } from '@/shared/components/protected-link';

import { HomeProfileButton } from './home-profile-button';
import { HomeReveal } from './home-reveal';

export const HomeHeroSection = () => {
  return (
    <PageContainer className="py-margin-xxl flex items-center gap-6">
      <div className="flex flex-1 flex-col gap-10 pr-6">
        <HomeReveal className="flex max-w-[544px] flex-col gap-4">
          <h1 className="text-display-base text-text-basic leading-normal font-bold">
            당신의 소프트스킬,
            <br />
            <span className="text-primary-500">&apos;데이터&apos;</span>로 본 적 있나요?
          </h1>

          <p className="text-body-base text-text-subtle leading-normal font-normal">
            텍스트로 나열된 스펙으로만 당신이 얼마나 훌륭한 동료인지 보여줄 수 없습니다.
            <br />
            소프트스킬을 증명하고 원하는 팀에 합류하세요.
          </p>
        </HomeReveal>

        <HomeReveal className="flex items-center gap-4" delay={0.1}>
          <Button asChild variant="primary" size="large">
            <ProtectedLink href="/projects">프로젝트 생성하기</ProtectedLink>
          </Button>
          <Suspense
            fallback={
              <Button variant="tertiary" size="large" disabled>
                내 프로필 보기
              </Button>
            }
          >
            <HomeProfileButton />
          </Suspense>
        </HomeReveal>
      </div>

      <HomeReveal className="relative h-[440px] w-full max-w-[588px] flex-1" delay={0.1}>
        <Image
          src="/home-renewal/hero-role-pointers.svg"
          alt=""
          fill
          className="object-contain object-center"
          priority
          sizes="588px"
        />
      </HomeReveal>
    </PageContainer>
  );
};
