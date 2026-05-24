import { apiRequest } from '@/shared/lib/api';

import type { Profile } from '../types/mypage.types';

export const fetchProfile = async (): Promise<Profile> => apiRequest('/users/profile');
