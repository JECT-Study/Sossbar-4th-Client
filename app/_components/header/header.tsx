import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import { getQueryClient } from '@/shared/lib/get-query-client';

import { HeaderAuthArea } from './header-auth-area';
import { HeaderMainNav } from './header-main-nav';

export const Header = async () => {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfile({ headers: { Cookie: cookieStore.toString() } }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="bg-gray-0/95 sticky top-0 z-50 border-b border-gray-200 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:h-16 sm:gap-6 sm:px-6 lg:px-0">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" className="relative flex h-[36px] shrink-0 items-center">
              <Image
                src="/Sossbar_logo.svg"
                alt="Sossbar"
                width={161}
                height={36}
                className="h-[36px] w-auto"
                priority
              />
            </Link>
            <HeaderMainNav />
          </div>
          <HeaderAuthArea />
        </div>
      </header>
    </HydrationBoundary>
  );
};
