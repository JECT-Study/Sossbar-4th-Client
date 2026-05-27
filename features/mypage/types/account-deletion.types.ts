import type { WithdrawReasonValue } from '../account-deletion.constants';

export interface DeleteAccountPayload {
  reason: WithdrawReasonValue;
  detail?: string;
}

export interface DeleteAccountResponse {
  userId: number;
}
