import { authHandlers } from './auth';
import { mypageHandlers } from './mypage';
import { projectsHandlers } from './projects';
import { reviewsHandlers } from './reviews';
import { usersHandlers } from './users';

export const handlers = [...authHandlers, ...usersHandlers, ...reviewsHandlers, ...projectsHandlers, ...mypageHandlers];
