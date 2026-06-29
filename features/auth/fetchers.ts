import { apiRequest } from '@/shared/lib/api';
import type { ApiRequestOptions } from '@/shared/lib/api';

import type { UserInfoResDto } from './types';

export const getMyProfile = (init?: ApiRequestOptions): Promise<UserInfoResDto> =>
  apiRequest<UserInfoResDto>('/users/profile', init);
