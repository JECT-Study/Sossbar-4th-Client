import Image from 'next/image';
import { Suspense } from 'react';

import { Button } from '@/shared/components/button/button';
import { PageContainer } from '@/shared/components/page-container';
import { ProtectedLink } from '@/shared/components/protected-link';
import { cn } from '@/shared/lib/cn';

import { HomeProfileButton } from './home-profile-button';
import { HomeReveal } from './home-reveal';

const MOBILE_ROLE_POINTERS = [
  {
    label: 'Project Manager',
    className: 'left-[4%] top-0',
    colorClassName: 'text-tertiary-300',
    pillClassName: 'bg-tertiary-300',
    arrowSide: 'right',
  },
  {
    label: 'Frontend Developer',
    className: 'left-[48%] top-[17px]',
    colorClassName: 'text-success-300',
    pillClassName: 'bg-success-300',
    arrowSide: 'left',
  },
  {
    label: 'Product Designer',
    className: 'left-0 top-[71px]',
    colorClassName: 'text-[#df95ff]',
    pillClassName: 'bg-[#df95ff]',
    arrowSide: 'right',
  },
  {
    label: 'Backend Developer',
    className: 'left-[53%] top-[83px]',
    colorClassName: 'text-primary-300',
    pillClassName: 'bg-primary-300',
    arrowSide: 'left',
  },
] as const;

/** 데스크톱 hero-role-pointers.svg와 동일한 커서형 화살표 */
const RolePointerCursor = ({ side }: { side: 'left' | 'right' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 21 21"
    fill="currentColor"
    aria-hidden
    className={cn('shrink-0', side === 'left' ? '-mt-2.5 -mr-0.5' : '-mt-2.5 -ml-0.5 -scale-x-100')}
  >
    <path d="M1.214 1.213C1.109 1.317 1.039 1.45 1.013 1.595C0.986 1.74 1.004 1.89 1.064 2.024L9.305 20.567C9.363 20.697 9.457 20.807 9.576 20.884C9.695 20.961 9.834 21.001 9.976 21C10.118 20.999 10.257 20.956 10.375 20.878C10.493 20.799 10.585 20.688 10.641 20.557L13.615 13.614L20.559 10.639C20.689 10.583 20.8 10.49 20.879 10.372C20.957 10.254 20.999 10.116 21 9.974C21.001 9.833 20.961 9.694 20.884 9.575C20.807 9.456 20.697 9.362 20.568 9.304L2.025 1.063C1.891 1.003 1.741 0.985 1.597 1.012C1.452 1.039 1.318 1.109 1.214 1.213Z" />
  </svg>
);

const HomeHeroMobileRolePointers = () => {
  return (
    <div className="relative mx-auto h-[140px] w-full max-w-[350px] lg:hidden" aria-hidden>
      {MOBILE_ROLE_POINTERS.map(({ label, className, colorClassName, pillClassName, arrowSide }) => (
        <div key={label} className={cn('absolute flex items-start', className, colorClassName)}>
          {arrowSide === 'left' ? <RolePointerCursor side="left" /> : null}
          <span
            className={cn(
              'text-text-basic-inverse inline-flex rounded-full px-2 py-2 text-[14px] leading-5 font-bold whitespace-nowrap',
              pillClassName,
            )}
          >
            {label}
          </span>
          {arrowSide === 'right' ? <RolePointerCursor side="right" /> : null}
        </div>
      ))}
    </div>
  );
};

export const HomeHeroSection = () => {
  return (
    <PageContainer className="py-margin-xxl flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-6">
      <div className="flex w-full flex-1 flex-col items-center gap-6 text-center lg:items-start lg:gap-10 lg:pr-6 lg:text-left">
        <HomeReveal className="flex w-full max-w-[544px] flex-col gap-4">
          <h1 className="text-display-sm lg:text-display-base text-text-basic leading-normal font-bold">
            당신의 소프트스킬,
            <br />
            <span className="text-primary-500">&apos;데이터&apos;</span>로 본 적 있나요?
          </h1>

          <p className="text-body-base text-text-subtle leading-normal font-normal">
            텍스트로 나열된 스펙으로만 당신이 얼마나 훌륭한 동료인지 보여줄 수 없습니다.
            <br className="hidden lg:inline" />
            소프트스킬을 증명하고 원하는 팀에 합류하세요.
          </p>
        </HomeReveal>

        <HomeReveal className="flex w-full flex-col items-center gap-4 lg:items-start" delay={0.1}>
          <div className="flex w-full max-w-[350px] flex-col gap-4 sm:max-w-none sm:flex-row sm:items-center lg:justify-start">
            <Button asChild variant="primary" size="large" className="w-full sm:w-auto">
              <ProtectedLink href="/projects">프로젝트 생성하기</ProtectedLink>
            </Button>
            <Suspense
              fallback={
                <Button variant="tertiary" size="large" disabled className="w-full sm:w-auto">
                  내 프로필 보기
                </Button>
              }
            >
              <HomeProfileButton className="w-full sm:w-auto" />
            </Suspense>
          </div>

          <HomeHeroMobileRolePointers />
        </HomeReveal>
      </div>

      <HomeReveal className="relative hidden h-[440px] w-full max-w-[588px] flex-1 lg:block" delay={0.1}>
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
