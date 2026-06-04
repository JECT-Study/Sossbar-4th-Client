import { PageContainer } from '@/shared/components/page-container';

import { ProfileExamplesClient } from './profile-examples-client';

const DEMO_PROFILE_USER_ID = 1;

const ProfileExamplesPage = () => {
  return (
    <PageContainer className="mb-20">
      <ProfileExamplesClient userId={DEMO_PROFILE_USER_ID} />
    </PageContainer>
  );
};

export default ProfileExamplesPage;
