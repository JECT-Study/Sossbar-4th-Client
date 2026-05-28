import { z } from 'zod';

import { BIO_MAX_LENGTH, NAME_MAX_LENGTH } from './signup-constants';

const agreementsSchema = z.object({
  age: z.boolean(),
  terms: z.boolean(),
  privacy: z.boolean(),
  marketing: z.boolean(),
});

export const SignupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: '이름은 2자 이상 20자 이하로 입력해 주세요.' })
      .max(NAME_MAX_LENGTH, `이름은 ${NAME_MAX_LENGTH}자 이하로 입력해 주세요.`),
    bio: z
      .string()
      .min(1, { message: '한 줄 소개를 입력해 주세요.' })
      .max(BIO_MAX_LENGTH, `한 줄 소개는 ${BIO_MAX_LENGTH}자 이하로 입력해 주세요.`),
    agreements: agreementsSchema,
  })
  .superRefine((data, ctx) => {
    if (!data.agreements.age) {
      ctx.addIssue({
        code: 'custom',
        message: '필수 약관에 동의해 주세요.',
        path: ['agreements', 'age'],
      });
    }
    if (!data.agreements.terms) {
      ctx.addIssue({
        code: 'custom',
        message: '필수 약관에 동의해 주세요.',
        path: ['agreements', 'terms'],
      });
    }
    if (!data.agreements.privacy) {
      ctx.addIssue({
        code: 'custom',
        message: '필수 약관에 동의해 주세요.',
        path: ['agreements', 'privacy'],
      });
    }
  });
