import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

const mockNotifications = [
  {
    notificationId: 1,
    type: 'CONFIRM',
    message: '프로젝트 팀원이 확정됐어요. 후기를 작성해주세요!',
    isRead: false,
    createdAt: '2026-04-20T00:00:00Z',
  },
  {
    notificationId: 2,
    type: 'ARCHIVED',
    message: '모든 팀원이 후기를 작성했어요.',
    isRead: true,
    createdAt: '2026-04-19T00:00:00Z',
  },
];

export const notificationsHandlers = [
  http.post(`${BASE}/notifications/confirm`, () => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.post(`${BASE}/notifications/archived`, () => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.get(`${BASE}/notifications/all`, () => {
    return HttpResponse.json({ data: mockNotifications });
  }),

  http.patch(`${BASE}/notifications/read/:notificationId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${BASE}/notifications/read/all`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
