import { PageContainer } from '@/shared/components/page-container';
import { cn } from '@/shared/lib/cn';

import { HomeReveal, HomeRevealGroup, HomeRevealItem } from './home-reveal';
import { HomeSectionHeader } from './home-section-header';

type CareerPillar = {
  step: number;
  title: string;
  subtitle: string;
  proofTarget: string;
  existingLimit: string;
  sossbarRole: string;
  highlighted: boolean;
};

const CAREER_PILLARS: CareerPillar[] = [
  {
    step: 1,
    title: '기술 스택',
    subtitle: 'Hard Skill',
    proofTarget: '다룰 줄 아는 언어, 프레임워크',
    existingLimit: '혼자서만 증명 가능한 영역',
    sossbarRole: '기존 기술 이력과 유연하게 연동',
    highlighted: false,
  },
  {
    step: 2,
    title: '프로젝트 경험',
    subtitle: 'Project',
    proofTarget: '참여한 프로젝트, 담당 기능',
    existingLimit: '본인의 주관적인 서술만 가능',
    sossbarRole: '프로젝트별 기여도 객관화',
    highlighted: false,
  },
  {
    step: 3,
    title: '협업 신뢰',
    subtitle: 'Soft Skill',
    proofTarget: '소통 능력, 책임감, 문제 해결력',
    existingLimit: '증명할 방법이 없었음',
    sossbarRole: '함께 일한 동료의 데이터로 인증',
    highlighted: true,
  },
];

type CareerPillarCardProps = {
  pillar: CareerPillar;
};

const CareerPillarCard = ({ pillar }: CareerPillarCardProps) => {
  return (
    <article
      className={cn(
        'flex min-h-[310px] w-full max-w-[384px] flex-col rounded-xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.1)]',
        pillar.highlighted ? 'border-border-primary bg-surface-primary-subtler border' : 'bg-surface-white',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-detail-xs text-text-subtle font-medium uppercase">{pillar.subtitle}</span>
          <h3
            className={cn('text-heading-sm font-bold', pillar.highlighted ? 'text-element-primary' : 'text-text-basic')}
          >
            {pillar.title}
          </h3>
        </div>
        <div
          className={cn(
            'text-heading-base flex size-10 shrink-0 items-center justify-center rounded-full font-bold',
            pillar.highlighted
              ? 'bg-button-primary-fill text-text-basic-inverse'
              : 'bg-surface-gray-subtler text-text-basic',
          )}
          aria-hidden
        >
          {pillar.step}
        </div>
      </div>

      <dl className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <dt className="text-detail-xs text-text-basic font-medium">주요 증명 대상</dt>
          <dd className="text-body-sm text-text-subtle font-medium">{pillar.proofTarget}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-detail-xs text-text-basic font-medium">기존 방식의 한계</dt>
          <dd className="text-body-sm text-text-subtle font-medium">{pillar.existingLimit}</dd>
        </div>
        <div
          className={cn(
            'flex flex-col gap-1 rounded-lg p-3',
            pillar.highlighted ? 'bg-surface-white' : 'bg-surface-gray-subtler',
          )}
        >
          <dt className="text-detail-xs text-text-basic font-medium">소스바의 역할</dt>
          <dd className={cn('text-body-sm font-medium', pillar.highlighted ? 'text-text-primary' : 'text-text-subtle')}>
            {pillar.sossbarRole}
          </dd>
        </div>
      </dl>
    </article>
  );
};

export const HomeCareerSection = () => {
  return (
    <section className="h-[800px] bg-white">
      <PageContainer className="flex h-full flex-col items-center justify-center">
        <HomeReveal className="w-full" amount={0.5}>
          <HomeSectionHeader
            badge="커리어의 완성"
            heading="하드 스킬과 소프트 스킬을 한번에!"
            description="커리어를 위해 필요한 3가지 요소를 소스바에서 한 눈에 볼 수 있습니다."
          />
        </HomeReveal>

        <HomeRevealGroup
          className="gap-margin-l mt-10 flex w-full flex-col items-center justify-center lg:flex-row"
          amount={0.5}
        >
          {CAREER_PILLARS.map((pillar) => (
            <HomeRevealItem key={pillar.step} className="flex w-full max-w-[384px] justify-center">
              <CareerPillarCard pillar={pillar} />
            </HomeRevealItem>
          ))}
        </HomeRevealGroup>
      </PageContainer>
    </section>
  );
};
