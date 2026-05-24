import { authHandlers } from './auth';
import { projectsHandlers } from './projects';
import { reviewsHandlers } from './reviews';
import { usersHandlers } from './users';

export const handlers = [...authHandlers, ...usersHandlers, ...reviewsHandlers, ...projectsHandlers];
