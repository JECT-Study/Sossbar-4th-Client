import { fetchProfileById } from '@/features/profile';
import { PageContainer } from '@/shared/components/page-container';

import { ProfileExamplesClient } from './profile-examples-client';

const DEMO_PROFILE_USER_LINK = '1';

const ProfileExamplesPage = async () => {
  const profile = await fetchProfileById(DEMO_PROFILE_USER_LINK);

  return (
    <PageContainer className="mb-20">
      <ProfileExamplesClient userId={profile.userId} userLink={profile.userLink} />
    </PageContainer>
  );
};

export default ProfileExamplesPage;
