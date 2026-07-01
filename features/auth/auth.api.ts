import { apiRequest } from '@/shared/lib/api';

import type { DeleteAccountPayload, KakaoLoginResult, SignupPayload, SignupResponse } from './auth.types';

const KAKAO_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.sossbar.com';

const createSignupFormData = ({
  name,
  bio,
  requiredAgree,
  profileImage,
  positions,
  links,
}: SignupPayload): FormData => {
  const formData = new FormData();

  formData.append(
    'onboarding',
    new Blob(
      [
        JSON.stringify({
          username: name,
          bio,
          defaultPositions: positions,
          links,
          requiredAgree,
          // marketingAgree는 별도 수집 없이 전송 시점에만 true로 고정
          marketingAgree: true,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  if (profileImage) {
    formData.append('profileImage', profileImage, profileImage.name);
  } else {
    formData.append('profileImage', new Blob([]), '');
  }

  return formData;
};

export const createSignup = (payload: SignupPayload): Promise<SignupResponse> =>
  apiRequest<SignupResponse>('/users/onboarding', {
    method: 'POST',
    body: createSignupFormData(payload),
  });

export const deleteAccount = async (payload: DeleteAccountPayload): Promise<void> => {
  await apiRequest('/users', { method: 'DELETE', body: payload });
};

// 인가코드 → 세션 쿠키 교환. 실패 시 ok:false (route가 '/'로 리다이렉트)
export const exchangeKakaoCode = async (code: string): Promise<KakaoLoginResult> => {
  const res = await fetch(`${KAKAO_API_BASE}/api/v1/login/kakao?code=${encodeURIComponent(code)}`);
  if (!res.ok) {
    return { ok: false, setCookieHeaders: [], accessTokenCookie: '' };
  }
  const setCookieHeaders = res.headers.getSetCookie();
  const accessTokenCookie = setCookieHeaders.find((c) => c.startsWith('accessToken='))?.split(';')[0] ?? '';
  return { ok: true, setCookieHeaders, accessTokenCookie };
};

// 프로필 조회로 온보딩 필요 여부 판정. fetch 실패 = 온보딩 필요(true)
export const fetchNeedsOnboarding = async (accessTokenCookie: string): Promise<boolean> => {
  const res = await fetch(`${KAKAO_API_BASE}/api/v1/users/profile`, { headers: { Cookie: accessTokenCookie } });
  if (!res.ok) {
    return true;
  }
  const body = (await res.json()) as { data?: { username?: string | null } };
  return !body.data?.username?.trim();
};
