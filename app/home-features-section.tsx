import Image from 'next/image';

interface Feature {
  title: string;
  description: string;
  imageSrc: string;
}

const FEATURES: Feature[] = [
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
];

export const HomeFeaturesSection = () => {
  return (
    <section id="home-features-section" className="bg-gray-0 flex h-[800px] w-full items-center py-[80px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center self-center">
        <div className="flex w-full flex-col items-center">
          <div className="text-element-primary bg-button-secondary-fill box-border flex h-[32px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] text-center text-[14px] leading-none font-normal whitespace-nowrap">
            주요 기능
          </div>
          <h2 className="text-text-basic mt-2 w-full text-center text-[48px] leading-[150%] font-bold">
            보이지 않던 협업 역량을 투명한 데이터로!
          </h2>
          <p className="text-text-subtle mt-2 w-full text-center text-[20px] leading-[150%] font-normal">
            기술, 스펙, 스킬은 포트폴리오나 깃허브로 증명할 수 있지만 소통 방식과 책임감과 같은 소프트스킬은 어떻게
            보여주시나요?
          </p>
        </div>

        <div className="mt-10 box-border flex h-[208px] w-full max-w-[1200px] flex-none items-stretch gap-6">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="border-border-gray-light bg-surface-white box-border flex h-full w-[282px] shrink-0 flex-col overflow-hidden rounded-xl border p-4"
            >
              <div className="bg-primary-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Image src={feature.imageSrc} alt={feature.title} width={20} height={20} className="shrink-0" />
              </div>
              <h3 className="text-text-basic text-heading-sm mt-3 shrink-0 font-bold">{feature.title}</h3>
              <p className="text-text-subtle text-body-sm mt-2 line-clamp-3 min-h-0 leading-5">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
