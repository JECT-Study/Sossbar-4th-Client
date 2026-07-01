import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchMyProfile } from '@/features/profile';
import { ROUTES } from '@/shared/constants/routes';

const Page = async () => {
  const cookieStore = await cookies();
  const myProfile = await fetchMyProfile({ headers: { Cookie: cookieStore.toString() } });

  redirect(ROUTES.PROFILE(myProfile.userId));
};

export default Page;
