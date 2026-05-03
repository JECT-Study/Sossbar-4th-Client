import { authHandlers } from './auth';
import { notificationsHandlers } from './notifications';
import { projectsHandlers } from './projects';
import { reviewsHandlers } from './reviews';
import { usersHandlers } from './users';

export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...projectsHandlers,
  ...reviewsHandlers,
  ...notificationsHandlers,
];
