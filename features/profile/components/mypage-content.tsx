'use client';

import { MypageAlertSection } from './mypage-alert-section';
import { MypageBasicInfoSection } from './mypage-basic-info-section';
import { MypageCareerSection } from './mypage-career-section';
import { useMyProfile } from '../hooks/use-my-profile.query';

export const MypageContent = () => {
  const { data: profile } = useMyProfile();

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[30px]">
      <header className="border-border-gray-light flex flex-col gap-2 border-b-[3px] pt-[62px] pb-8">
        <h1 className="text-heading-lg text-text-basic font-bold">마이페이지</h1>
        <p className="text-heading-xs text-text-subtle">기본 정보, 커리어 정보, 알림 수신여부를 수정할 수 있어요</p>
      </header>

      <MypageBasicInfoSection profile={profile} />
      <MypageCareerSection />
      <MypageAlertSection />
    </div>
  );
};
