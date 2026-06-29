'use client';

import Link from 'next/link';
import { Avatar } from 'radix-ui';

import { Dropdown } from '@/shared/components/dropdown';
import { NotificationBell } from '@/shared/components/notification';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

import type { Profile } from '../profile.types';

const DEFAULT_AVATAR_SRC = '/sample_user.svg';

const dropdownItemClassName =
  'text-body-sm text-text-basic !h-[44px] min-h-0 shrink-0 justify-start rounded-md px-2 py-0 font-normal';

interface Props {
  myProfile: Profile;
  onLogout: () => void;
}

export const HeaderMyProfile = ({ myProfile, onLogout }: Props) => {
  const avatarSrc = myProfile.profileImageUrl || DEFAULT_AVATAR_SRC;
  const name = myProfile.username ?? myProfile.email;

  return (
    <div className="flex h-10 items-center gap-4">
      <NotificationBell />
      <Dropdown.Root>
        <Dropdown.Trigger
          type="button"
          className={cn(
            'flex h-10 max-w-[220px] items-center gap-2 rounded-lg px-1 outline-none',
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
          className="border-border-gray-light w-[121px] max-w-[121px] min-w-[121px] flex-col gap-2 overflow-hidden rounded-lg border p-2"
        >
          <Dropdown.Item asChild className={dropdownItemClassName}>
            <Link href={ROUTES.MY_PAGE} className="flex h-full w-full items-center">
              마이페이지
            </Link>
          </Dropdown.Item>
          <Dropdown.Item className={dropdownItemClassName} onSelect={onLogout}>
            로그아웃
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
};
