'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar } from 'radix-ui';
import { useState } from 'react';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import type { Profile } from '@/features/profile/profile.types';
import { KakaoLoginButton } from '@/shared/components/button/kakao-login-button';
import { Dropdown } from '@/shared/components/dropdown';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

const DEFAULT_AVATAR_SRC = '/sample_user.svg';

const dropdownItemClassName =
  'text-body-sm text-text-basic !h-[44px] min-h-0 shrink-0 justify-start rounded-md px-2 py-0 font-normal';

interface Props {
  initialProfile: Profile;
}

export const HeaderAuthAreaClient = ({ initialProfile }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: queryProfile } = useMyProfile();
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const profile = hasLoggedOut ? null : (queryProfile ?? initialProfile);

  if (!profile) {
    return <KakaoLoginButton />;
  }

  const avatarSrc = profile.profileImageUrl || DEFAULT_AVATAR_SRC;
  const name = profile.username ?? profile.email;

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        type="button"
        className={cn(
          'flex min-h-10 max-w-[220px] items-center gap-[8px] rounded-lg px-1 outline-none',
          'hover:bg-surface-gray-subtler focus-visible:ring-border-primary focus-visible:ring-2',
        )}
        aria-label={`계정 메뉴, ${name}`}
      >
        <Avatar.Root className="bg-surface-gray-subtle relative h-[30px] w-[30px] shrink-0 overflow-hidden rounded-full">
          <Avatar.Image src={avatarSrc} alt={`${name}의 프로필 이미지`} />
          <Avatar.Fallback>{name.charAt(0)}</Avatar.Fallback>
        </Avatar.Root>
        <span className="text-detail-base text-text-subtle truncate leading-[150%] font-bold">{name}님</span>
      </Dropdown.Trigger>
      <Dropdown.Content
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="border-border-gray-light w-[121px] max-w-[121px] min-w-[121px] flex-col gap-[8px] overflow-hidden rounded-[8px] border p-[8px]"
      >
        <Dropdown.Item asChild className={dropdownItemClassName}>
          <Link href={ROUTES.MY_PAGE} className="flex h-full w-full items-center">
            마이페이지
          </Link>
        </Dropdown.Item>
        <Dropdown.Item
          className={dropdownItemClassName}
          onSelect={async () => {
            setHasLoggedOut(true);
            await fetch('/api/logout', { method: 'POST' });
            queryClient.clear();
            router.push(ROUTES.HOME);
          }}
        >
          로그아웃
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
