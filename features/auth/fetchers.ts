import { apiRequest } from '@/shared/lib/api';

import type { UserInfoResDto } from './types';

export const getMyProfile = (): Promise<UserInfoResDto> => apiRequest<UserInfoResDto>('/users/profile');
