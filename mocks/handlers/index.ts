import { authHandlers } from './auth';
import { profileHandlers } from './profile';
import { reviewsHandlers } from './reviews';
import { usersHandlers } from './users';

export const handlers = [...authHandlers, ...usersHandlers, ...profileHandlers, ...reviewsHandlers];
