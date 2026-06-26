import Image from 'next/image';

import { PageContainer } from '@/shared/components/page-container';

import { HomeSectionHeader } from './home-section-header';

const FEATURES = [
  {
    title: '프로필 생성 및 관리',
    description: '닉네임, 한 줄 소개 등 기본 프로필을 등록하고 받은 협업 후기와 태그를 한 눈에',
    imageSrc: '/home-features-search.svg',
  },
  {
    title: '팩트 기반 피드백',
    description: '좋았던 점 아쉬웠던 점을 균형있게 전달하는 후기 시스템입니다.',
    imageSrc: '/home-features-target.svg',
  },
  {
    title: '소프트 스킬 스펙트럼',
    description: '원칙 vs 혁신, 유연함 vs 계획 등 협업 스타일을 다각도로 시각화합니다.',
    imageSrc: '/home-features-spectrum.svg',
  },
  {
    title: '프로필 외부 공유',
    description: '프로필 공유 URL을 생성하여 이력서 및 포트폴리오 그리고 노션 등에 첨부가 가능합니다.',
    imageSrc: '/home-features-share.svg',
  },
] as const;

export const HomeRenewalFeaturesSection = () => {
  return (
    <section className="relative h-[800px] overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[151px] left-1/2 h-[1026px] w-[min(3328px,200vw)] -translate-x-1/2"
      >
        <Image src="/home-renewal/features-background.svg" alt="" fill className="object-cover" sizes="200vw" />
      </div>

      <PageContainer className="relative z-10 flex h-full flex-col items-center justify-center">
        <HomeSectionHeader
          badge="주요 기능"
          heading="보이지 않던 협업 역량을 투명한 데이터로!"
          description="기술, 스펙, 스킬은 포트폴리오나 깃허브로 증명할 수 있지만 소통 방식과 책임감과 같은 소프트스킬은 어떻게 보여주시나요?"
        />

        <div className="gap-margin-l mt-10 grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="border-divider-1 bg-surface-white flex flex-col gap-2 rounded-2xl border p-4"
            >
              <div className="bg-primary-50 flex size-10 items-center justify-center rounded-full p-2">
                <Image src={feature.imageSrc} alt="" width={24} height={24} className="size-6" />
              </div>
              <h3 className="text-text-basic text-heading-sm font-bold">{feature.title}</h3>
              <p className="text-text-subtle text-body-sm min-h-[86px] leading-[1.5]">{feature.description}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};
