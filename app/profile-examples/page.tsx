import { ProfilePageContent } from '@/features/profile';

const DEMO_PROFILE_USER_ID = 1;

const ProfileExamplesPage = () => {
  return <ProfilePageContent userId={DEMO_PROFILE_USER_ID} isMyProfile />;
};

export default ProfileExamplesPage;
