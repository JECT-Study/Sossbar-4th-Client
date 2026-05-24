import { authHandlers } from './auth';

import { profileHandlers } from './profile';
import { projectsHandlers } from './projects';
import { reviewsHandlers } from './reviews';
import { usersHandlers } from './users';

export const handlers = [...authHandlers, ...usersHandlers, ...profileHandlers, ...projectsHandlers, ...reviewsHandlers];
