export interface DeleteAccountPayload {
  userDeleteReasonEnum: string;
  detail?: string;
}

export type DeleteAccountResponse = Record<string, never>;
