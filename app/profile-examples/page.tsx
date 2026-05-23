import { ProfilePageContent } from '@/features/profile';

const DEMO_PROFILE_USER_ID = 'example';

const ProfileExamplesPage = () => {
  return <ProfilePageContent userId={DEMO_PROFILE_USER_ID} isMyProfile={false} />;
};

export default ProfileExamplesPage;
