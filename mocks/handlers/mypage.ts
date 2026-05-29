import { http, HttpResponse } from 'msw';

const BASE = '/api/v1';

export const mypageHandlers = [
  http.delete(`${BASE}/users`, async () => {
    return HttpResponse.json({
      status: 200,
      code: 'COMMON-200',
      message: '성공적으로 조회했습니다.',
      data: {},
    });
  }),
];
