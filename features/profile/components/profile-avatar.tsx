import { Avatar } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

/** 업로드 이미지가 없을 때 표시하는 기본 프로필 이미지 */
const DEFAULT_PROFILE_IMAGE_SRC = '/default-profile.png';

interface Props {
  username: string;
  profileImageUrl: string | null;
  className?: string;
}

export const ProfileAvatar = ({ username, profileImageUrl, className }: Props) => {
  const fallbackText = username.trim().slice(0, 1) || '이름';
  const avatarSrc = profileImageUrl || DEFAULT_PROFILE_IMAGE_SRC;

  return (
    <Avatar.Root
      className={cn(
        'bg-action-gray-light flex size-25 shrink-0 items-center justify-center overflow-hidden rounded-full',
        className,
      )}
    >
      <Avatar.Image className="h-full w-full object-cover" src={avatarSrc} alt={`${username} 프로필 이미지`} />
      <Avatar.Fallback className="text-heading-lg text-text-subtle font-bold" delayMs={600}>
        {fallbackText}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};
