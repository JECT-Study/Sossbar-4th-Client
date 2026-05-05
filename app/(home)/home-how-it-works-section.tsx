import { PageContainer } from '@/shared/components/page-container';

import { HomeSectionHeader } from './home-section-header';

const STEPS = [
  {
    step: 1,
    title: '프로필 생성',
    description: '닉네임과 한 줄 소개로 협업 프로필을 개설하세요.',
  },
  {
    step: 2,
    title: '후기 요청',
    description: '함께 일한 동료에게 후기 요청 링크를 보내세요.',
  },
  {
    step: 3,
    title: '소프트 스킬 공유',
    description: '동료에게 받은 피드백이 자동으로 시각화되고 프로필을 공개 후 협업스킬을 증명하세요.',
  },
];

export const HomeHowItWorksSection = () => {
  return (
    <PageContainer className="flex h-[800px] w-full items-center py-20">
      <div className="flex w-full flex-col items-center self-center">
        <HomeSectionHeader badge="사용법" heading="Sossbar 이용 방법" headingClassName="mt-6" />

        <div className="mt-10 box-border flex h-[208px] w-full max-w-[1200px] flex-none items-stretch gap-6">
          {STEPS.map((step) => (
            <li
              key={step.step}
              className="relative box-border flex min-w-0 flex-1 flex-col items-start py-[16px] text-left"
            >
              <div
                className="bg-divider-gray-light pointer-events-none absolute top-11 right-0 left-7 z-0 h-px"
                aria-hidden
              />
              <div className="relative z-10 flex min-w-0 flex-col items-start">
                <div
                  className="text-text-basic bg-bg-white text-heading-base flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-center font-bold shadow-md"
                  aria-hidden
                >
                  {step.step}
                </div>
                <h3 className="text-text-basic text-heading-base mt-[16px] w-full font-bold">{step.title}</h3>
                <p className="text-text-subtle text-body-base mt-[16px] w-full leading-normal font-normal">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
