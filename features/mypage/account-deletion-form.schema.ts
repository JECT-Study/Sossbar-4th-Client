import { z } from 'zod';

import { WITHDRAW_REASON_VALUES } from './account-deletion.constants';

export type { WithdrawReasonValue } from './account-deletion.constants';

export const AccountDeletionFormSchema = z
  .object({
    reason: z.enum(WITHDRAW_REASON_VALUES, { error: '탈퇴 사유를 선택해 주세요.' }),
    detail: z.string().optional(),
  })
  .check((ctx) => {
    if (ctx.value.reason === 'other' && !ctx.value.detail?.trim()) {
      ctx.issues.push({
        code: 'custom',
        message: '탈퇴 사유를 입력해 주세요.',
        path: ['detail'],
        input: ctx.value.detail,
      });
    }
  });

export type AccountDeletionFormData = z.infer<typeof AccountDeletionFormSchema>;
