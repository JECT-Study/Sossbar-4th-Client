import { useMyProfile } from './use-my-profile.query';

/**
 * 조회 중인 프로필이 현재 로그인한 사용자의 프로필인지 확인한다.
 *
 * @param userId - 비교할 프로필 사용자 ID
 * @returns 현재 로그인한 사용자의 프로필이면 `true`, 아니면 `false`
 */
export const useIsMyProfile = (userId: number) => {
  const { data: myProfile } = useMyProfile();
  return myProfile?.userId === userId;
};
