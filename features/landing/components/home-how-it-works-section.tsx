import { PageContainer } from '@/shared/components/page-container';

import { HomeHowItWorksStepPreview } from './home-how-it-works-step-preview';
import { HomeReveal } from './home-reveal';
import { HomeSectionHeader } from './home-section-header';

const STEPS = [
  {
    step: 'STEP 1',
    title: '프로젝트 생성',
    description: ['회원가입 이후 프로젝트 관리 페이지로 들어가', '프로젝트를 생성하세요.'],
    variant: 'step1',
  },
  {
    step: 'STEP 2',
    title: '후기 요청',
    description: ['프로젝트 생성 후 함께 일한 동료에게', '후기 요청 링크를 보내세요.'],
    variant: 'step2',
  },
  {
    step: 'STEP 3',
    title: '협업 프로필 확인',
    description: [
      "동료에게 받은 후기가 '내 소스' 페이지에 자동으로 반영됩니다.",
      '해당 페이지에서 본인의 소프트 스킬을 확인 후 공유해보세요.',
    ],
    variant: 'step3',
  },
] as const;

export const HomeHowItWorksSection = () => {
  return (
    <section className="py-margin-xxl box-border flex flex-col items-center bg-white">
      <PageContainer className="gap-margin-xl flex w-full max-w-[1200px] flex-col items-center">
        <HomeReveal className="w-full">
          <HomeSectionHeader badge="사용법" heading="Sossbar 이용 방법" />
        </HomeReveal>

        <div className="flex w-full max-w-[1200px] flex-col gap-12 lg:gap-20">
          {STEPS.map((step) => (
            <HomeReveal key={step.step} className="flex w-full flex-col items-center gap-6 lg:flex-row" amount={0.4}>
              <div className="gap-margin-m py-padding-m relative flex w-full flex-col lg:h-[260px] lg:flex-1">
                <div
                  aria-hidden
                  className="bg-divider-1 pointer-events-none absolute top-11 right-0 left-[7.09%] hidden h-px lg:block"
                />
                <div className="bg-surface-white text-text-primary relative z-10 flex h-14 w-[112px] shrink-0 items-center justify-center rounded-full px-4 shadow-[0px_4px_12px_rgba(0,0,0,0.1)]">
                  <span className="text-heading-base font-bold whitespace-nowrap">{step.step}</span>
                </div>
                <div className="gap-margin-m flex flex-col pl-4">
                  <h3 className="text-text-basic text-heading-base font-bold">{step.title}</h3>
                  <div className="text-text-subtle text-body-base leading-[1.5]">
                    {step.description.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              <HomeHowItWorksStepPreview variant={step.variant} title={step.title} />
            </HomeReveal>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};
