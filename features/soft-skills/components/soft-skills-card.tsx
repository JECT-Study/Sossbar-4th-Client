'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';
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
    <ProfileStatCard
      title="소프트 스킬 스펙트럼"
      info
      infoLabel="동료들의 평가를 기반으로 자동 산출된 협업 성향이에요"
      className={cn('w-[585px]', showDistribution ? 'h-[652px]' : 'h-auto')}
    >
      {spectrumInfo.totalCount === 0 ? (
        <EmptyState title="받은 후기가 없어요" />
      ) : (
        <>
          <SoftSkillsSpectrum spectrumInfo={spectrumInfo} />
          {!!showDistribution && <SoftSkillsDistribution spectrumInfo={spectrumInfo} />}
          <div className="bg-surface-gray-subtler mt-auto rounded-lg px-4 py-3">
            <p className="text-detail-sm text-text-subtle font-normal">
              * 지표는 동료들의 평가를 기반으로 자동 산출됩니다.
            </p>
          </div>
        </>
      )}
    </ProfileStatCard>
  );
};
