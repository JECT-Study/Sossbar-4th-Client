'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { cn } from '@/shared/lib/cn';

import { SoftSkillsDistribution } from './soft-skills-distribution';
import { SoftSkillsSpectrum } from './soft-skills-spectrum';
import { useSpectrum } from '../hooks/use-spectrum';

interface Props {
  userId: number;
  projectId?: number;
  showDistribution?: boolean;
}

export const SoftSkillsCard = ({ userId, projectId, showDistribution = true }: Props) => {
  const { data: spectrumInfo } = useSpectrum({ userId, projectId });

  return (
    <section
      className={cn(
        'border-border-gray flex w-[588px] flex-col overflow-hidden rounded-2xl border bg-white p-6',
        showDistribution ? 'h-[652px]' : 'h-auto',
      )}
    >
      <h2 className="text-heading-base h-6 leading-6 font-bold text-black">소프트 스킬 스펙트럼</h2>

      {spectrumInfo.totalCount === 0 ? (
        <EmptyState title="받은 후기가 없어요" />
      ) : (
        <>
          <SoftSkillsSpectrum spectrumInfo={spectrumInfo} />
          {!!showDistribution && <SoftSkillsDistribution spectrumInfo={spectrumInfo} />}
          <p className="text-detail-base text-text-disabled mt-7 h-6 font-normal">
            * 지표는 동료들의 평가를 기반으로 자동 산출됩니다.
          </p>
        </>
      )}
    </section>
  );
};
