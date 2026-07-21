'use client';

import { EmptyState } from '@/shared/components/empty-state';
import { ProfileStatCard } from '@/shared/components/profile-stat-card';
import { cn } from '@/shared/lib/cn';

import { SpectrumAverageSection } from './spectrum-average-section';
import { SpectrumDistributionSection } from './spectrum-distribution-section';
import { useSpectrum } from '../spectrum.hooks';

interface Props {
  userLink: string;
  projectId?: number;
  showDistribution?: boolean;
}

export const SpectrumCard = ({ userLink, projectId, showDistribution = true }: Props) => {
  const { data: spectrumInfo } = useSpectrum({ userLink, projectId });

  return (
    <ProfileStatCard
      title="소프트 스킬 스펙트럼"
      info
      infoLabel="동료들의 평가를 기반으로 자동 산출된 협업 성향이에요"
      className={cn('w-full lg:w-[585px]', showDistribution ? 'h-auto lg:h-[652px]' : 'h-auto')}
    >
      {spectrumInfo.totalCount === 0 ? (
        <EmptyState title="받은 후기가 없어요" />
      ) : (
        <>
          <SpectrumAverageSection spectrumInfo={spectrumInfo} />
          {!!showDistribution && <SpectrumDistributionSection spectrumInfo={spectrumInfo} />}
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
