import { ProfilePageContent } from '@/features/profile';

// 추후 정적 예시 데이터 기반으로 재구현 예정
const DEMO_PROFILE_USER_ID = 0;

const ProfileExamplesPage = () => {
  return <ProfilePageContent userId={DEMO_PROFILE_USER_ID} isMyProfile={false} />;
};

export default ProfileExamplesPage;
