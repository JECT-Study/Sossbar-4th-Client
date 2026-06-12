import { http, HttpResponse } from 'msw';

import type { NotificationItem } from '@/features/notifications/notification.types';

const BASE = '/api/v1';

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

let mockNotifications: NotificationItem[] = [
  {
    notificationId: 1,
    title: '초대장이 도착했어요',
    description: '새 프로젝트에 참여해 보세요',
    isRead: false,
    createdAt: hoursAgo(1),
  },
  {
    notificationId: 2,
    title: '팀이 확정되었어요',
    description: 'Sossbar 4기 프로젝트 · 후기를 작성해 보세요',
    isRead: false,
    createdAt: hoursAgo(1),
  },
  {
    notificationId: 3,
    title: '후기가 제출되었어요',
    description: '민지님에게 후기를 남겼습니다',
    isRead: true,
    createdAt: daysAgo(1),
  },
];

const success = <T>(data: T) =>
  HttpResponse.json({
    status: 200,
    code: 'COMMON-200',
    message: '성공적으로 조회했습니다.',
    data,
  });

export const notificationsHandlers = [
  http.get(`${BASE}/notifications/all`, () => success(mockNotifications)),

  http.patch(`${BASE}/notifications/read/all`, () => {
    mockNotifications = mockNotifications.map((item) => ({ ...item, isRead: true }));
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${BASE}/notifications/read/:notificationId`, ({ params }) => {
    const notificationId = Number(params.notificationId);
    mockNotifications = mockNotifications.map((item) =>
      item.notificationId === notificationId ? { ...item, isRead: true } : item,
    );
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${BASE}/notifications/confirm`, () => new HttpResponse(null, { status: 201 })),

  http.post(`${BASE}/notifications/archived`, () => new HttpResponse(null, { status: 201 })),
];
