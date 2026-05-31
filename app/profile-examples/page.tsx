import { ProfileSectionBoundary } from '@/features/profile';

const DEMO_PROFILE_USER_ID = 1;

const ProfileExamplesPage = () => {
  return <ProfileSectionBoundary userId={DEMO_PROFILE_USER_ID} />;
};

export default ProfileExamplesPage;
