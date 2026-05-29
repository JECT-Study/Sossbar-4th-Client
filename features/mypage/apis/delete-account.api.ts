import { apiRequest } from '@/shared/lib/api';

import type { DeleteAccountPayload, DeleteAccountResponse } from '../types/account-deletion.types';

export const deleteAccount = (payload: DeleteAccountPayload): Promise<DeleteAccountResponse> =>
  apiRequest<DeleteAccountResponse>('/users', { method: 'DELETE', body: payload });
