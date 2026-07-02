import Image from 'next/image';

import { Button } from '@/shared/components/button/button';
import { ProtectedLink } from '@/shared/components/protected-link';

import { HomeReveal } from './home-reveal';

export const HomeCtaSection = () => {
  return (
    <section
      id="home-cta-section"
      className="relative z-10 bg-[#050814] bg-[url('/home-cta-background.svg')] bg-cover bg-center bg-no-repeat py-30"
    >
      <div className="mx-auto w-full max-w-300 px-4 sm:px-6">
        <div className="relative isolate flex min-h-109.5 w-full items-start justify-start gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(24,30,52,0.28)] p-0 shadow-[0_1.5rem_5rem_rgba(0,0,0,0.45)] backdrop-blur-[1.5rem]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(168,183,246,0.24)_0%,rgba(30,36,64,0.2)_44%,rgba(16,20,34,0.5)_100%)]" />
          <Image
            src="/overlay-blur-left.svg"
            alt=""
            width={586}
            height={438}
            sizes="(min-width: 75rem) 586px, 50vw"
            className="pointer-events-none absolute inset-y-0 -left-4 h-full w-auto max-w-[min(100%,36.625rem)] object-cover object-left select-none"
          />
          <Image
            src="/overlay-blur-right.svg"
            alt=""
            width={826}
            height={438}
            sizes="(min-width: 75rem) 826px, 50vw"
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-auto max-w-[min(100%,51.625rem)] object-cover object-right select-none"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_38%,rgba(0,0,0,0.28)_100%)]" />

          <HomeReveal className="relative z-10 flex min-h-109.5 w-full flex-col items-center pt-20 pb-10 text-center sm:px-4">
            <div className="flex w-full max-w-6xl flex-col items-center gap-4">
              <Image src="/home-cta-quotation-marks.svg" alt="" width={64} height={48} className="h-12 w-16" />
              <h2 className="text-text-basic-inverse text-heading-2xl font-bold">
                협업 스킬, 보이지 않는 데이터를 시각화 후 증명하세요
              </h2>
              <p className="text-body-xl text-text-basic-inverse w-full max-w-107 font-normal">
                프로필을 만들고 동료에게 첫 번째 후기를 요청해보세요
              </p>
            </div>

            <Button asChild variant="primary" size="large" className="mx-auto mt-10">
              <ProtectedLink href="/mypage">프로젝트 생성하러 가기</ProtectedLink>
            </Button>
          </HomeReveal>
        </div>
      </div>
    </section>
  );
};
