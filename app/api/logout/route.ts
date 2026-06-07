import { NextResponse } from 'next/server';

export const POST = () => {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
};
