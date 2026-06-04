import { Avatar } from 'radix-ui';

/** 업로드 이미지가 없을 때 표시하는 기본 프로필 이미지 */
const DEFAULT_PROFILE_IMAGE_SRC = '/default-profile.png';

type ProfileAvatarProps = {
  username: string;
  profileImageUrl: string | null;
};

export const ProfileAvatar = ({ username, profileImageUrl }: ProfileAvatarProps) => {
  const fallbackText = username.trim().slice(0, 1) || '이름';
  const avatarSrc = profileImageUrl || DEFAULT_PROFILE_IMAGE_SRC;

  return (
    <Avatar.Root className="bg-action-gray-light flex size-25 shrink-0 items-center justify-center overflow-hidden rounded-full">
      <Avatar.Image className="h-full w-full object-cover" src={avatarSrc} alt={`${username} 프로필 이미지`} />
      <Avatar.Fallback className="text-heading-lg text-text-subtle font-bold" delayMs={600}>
        {fallbackText}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};
