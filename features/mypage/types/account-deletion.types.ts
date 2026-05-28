export interface DeleteAccountPayload {
  userDeleteReasonEnum: string;
  detail?: string;
}

export interface DeleteAccountResponse {
  userId: number;
}
