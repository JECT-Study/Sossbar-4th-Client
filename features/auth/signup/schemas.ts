import { z } from 'zod';

import { BIO_MAX_LENGTH } from './constants';

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: '이름을 입력해 주세요.' })
    .max(100, { message: '이름은 100자 이하로 입력해 주세요.' }),
  bio: z
    .string()
    .min(1, { message: '한 줄 소개를 입력해 주세요.' })
    .max(BIO_MAX_LENGTH, { message: '한 줄 소개는 50자 이하로 입력해 주세요.' }),
  agreements: z.object({
    age: z.boolean(),
    terms: z.boolean(),
    privacy: z.boolean(),
    marketing: z.boolean(),
  }),
});
