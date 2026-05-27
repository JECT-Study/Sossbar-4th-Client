import { z } from 'zod';

import { PROFILE_BIO_MAX_LENGTH, PROFILE_IMAGE_MAX_SIZE, PROFILE_NICKNAME_MAX_LENGTH } from './constants';

const imageMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];

const isProfileImageFile = (value: unknown): value is File => {
  return typeof File !== 'undefined' && value instanceof File;
};

export const ProfileEditFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: '닉네임을 입력해 주세요.' })
    .max(PROFILE_NICKNAME_MAX_LENGTH, `닉네임은 ${PROFILE_NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요.`),
  bio: z.string().trim().max(PROFILE_BIO_MAX_LENGTH, `한 줄 소개는 ${PROFILE_BIO_MAX_LENGTH}자 이하로 입력해 주세요.`),
  profileImage: z
    .custom<File | null>((value) => value === null || isProfileImageFile(value), {
      message: '이미지 파일을 선택해 주세요.',
    })
    .refine((file) => file === null || imageMimeTypes.includes(file.type), {
      message: 'PNG, JPG, WEBP 이미지만 업로드할 수 있습니다.',
    })
    .refine((file) => file === null || file.size <= PROFILE_IMAGE_MAX_SIZE, {
      message: '이미지는 5MB 이하로 업로드해 주세요.',
    }),
});
