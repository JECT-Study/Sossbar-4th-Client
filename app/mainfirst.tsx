import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/shared/components/button';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

export const First = () => {
  return (
    <section className="bg-gray-0 pt-[80px] pb-[246px]">
      <div className="mx-auto flex h-[498px] w-full max-w-[1200px] items-center justify-start gap-[24px]">
        <div className="flex w-[588px] self-stretch py-[84px]">
          <div className="w-[544px]">
            <div className="min-h-[232px] w-full">
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
            </div>

            <div className="mt-[40px] flex items-center gap-4">
              <Link
                href={ROUTES.LOGIN}
                className={cn(buttonVariants({ variant: 'primary' }), 'h-14 w-[200px] px-0 text-[20px] font-medium')}
              >
                프로젝트 시작하기
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className={cn(buttonVariants({ variant: 'secondary' }), 'h-14 w-[176px] px-0 text-[20px] font-medium')}
              >
                내 프로필 보기
              </Link>
            </div>
          </div>
        </div>

        <div className="relative h-[440px] w-[588px] shrink-0">
          <div className="relative h-full w-full">
            <Image src="/Margin.svg" alt="Hero visual" fill className="object-contain" priority />
          </div>
        </div>
      </div>
    </section>
  );
};
