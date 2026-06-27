import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { fetchMyProfile } from '@/features/profile/api/fetch-my-profile';
import { profileKeys } from '@/features/profile/profile.query-keys';
import type { Profile } from '@/features/profile/profile.types';
import { getQueryClient } from '@/shared/lib/get-query-client';

import { HeaderAuthArea } from './header-auth-area';
import { HeaderMainNav } from './header-main-nav';

/**
 * 헤더 (Server Component).
 * 로그인 상태에 따라 헤더 영역을 동적으로 렌더링한다.
 */
export const Header = async () => {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfile({ headers: { Cookie: cookieStore.toString() } }),
  });
  const profile = queryClient.getQueryData<Profile>(profileKeys.my) ?? null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="border-divider-1 px-padding-l py-padding-m sticky top-0 z-50 border-b bg-white/45 backdrop-blur-[10px]">
        <div className="mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between">
          <div className="gap-margin-xl flex h-10 min-w-0 items-center">
            <Link href="/" className="flex h-10 w-[122px] shrink-0 items-center">
              <Image
                src="/Sossbar_logo.svg"
                alt="Sossbar"
                width={161}
                height={36}
                className="h-9 w-[122px] object-contain object-left"
                priority
              />
            </Link>
            <HeaderMainNav />
          </div>
          <div className="flex h-10 shrink-0 items-center">
            <HeaderAuthArea initialProfile={profile} />
          </div>
        </div>
      </header>
    </HydrationBoundary>
  );
};
