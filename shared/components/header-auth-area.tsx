'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import { clearSessionUser, useSessionUser } from '@/shared/lib/session-user';

import { buttonVariants } from './button/button';
import { Dropdown } from './dropdown';

const DEFAULT_AVATAR_SRC = '/sample_user.svg';

const HeaderAvatar = ({ src, alt }: { src: string; alt: string }) => {
  const isRemote = /^https?:\/\//i.test(src);

  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- 외부 프로필 URL
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    );
  }

  return <Image src={src} alt={alt} width={30} height={30} className="h-[30px] w-[30px] object-cover" sizes="30px" />;
};

export const HeaderAuthArea = () => {
  const router = useRouter();
  const sessionUser = useSessionUser();

  if (!sessionUser) {
    return (
      <Link href="/login" className={cn(buttonVariants({ variant: 'primary' }), 'h-10 w-[90px] self-center px-0')}>
        로그인
      </Link>
    );
  }

  const avatarSrc = sessionUser.profileImageUrl || DEFAULT_AVATAR_SRC;
  const label = `${sessionUser.nickname}님`;

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        type="button"
        className={cn(
          'flex min-h-10 max-w-[220px] items-center gap-[8px] rounded-lg px-1 outline-none',
          'hover:bg-(--color-surface-gray-subtler) focus-visible:ring-2 focus-visible:ring-(--color-border-primary)',
        )}
        aria-label={`계정 메뉴, ${sessionUser.nickname}`}
      >
        <span className="relative h-[30px] w-[30px] shrink-0 overflow-hidden rounded-full bg-(--color-surface-gray-subtle)">
          <HeaderAvatar src={avatarSrc} alt="" />
        </span>
        <span className="text-detail-base text-text-subtle truncate leading-[150%] font-bold">{label}</span>
      </Dropdown.Trigger>
      <Dropdown.Content
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="h-[112px] w-[121px] max-w-[121px] min-w-[121px] flex-col gap-[8px] overflow-hidden rounded-[8px] border border-(--color-border-gray-light) p-[8px]"
      >
        <Dropdown.Item
          asChild
          className="text-body-sm text-text-basic !h-[44px] min-h-0 shrink-0 justify-start rounded-md px-2 py-0 font-normal"
        >
          <Link
            href={ROUTES.MY_PAGE}
            className="text-body-sm text-text-basic flex h-full min-h-[44px] w-full items-center font-normal"
          >
            마이페이지
          </Link>
        </Dropdown.Item>
        <Dropdown.Item
          className="text-body-sm text-text-basic !h-[44px] min-h-0 shrink-0 justify-start rounded-md px-2 py-0 font-normal"
          onSelect={() => {
            clearSessionUser();
            router.push('/');
          }}
        >
          로그아웃
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
