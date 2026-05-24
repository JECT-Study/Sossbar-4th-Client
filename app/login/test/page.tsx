'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getMyProfile } from '@/features/auth/fetchers';
import { testAccountLogin } from '@/features/auth/test-account/fetchers';
import { Button } from '@/shared/components/button/button';
import { setAuthToken } from '@/shared/lib/auth-token';
import { setSessionUser } from '@/shared/lib/session-user';

/**
 * 로컬 테스트 전용 로그인 페이지.
 * 카카오 OAuth 없이 테스트 계정 토큰을 발급받아 실제 로그인 플로우(토큰 저장 → 프로필 조회 → 라우팅)를 재현합니다.
 */
const TestLoginPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleTestLogin = async () => {
    setStatus('loading');
    try {
      const { accessToken, userId } = await testAccountLogin();
      setAuthToken({ accessToken, userId });

      const profile = await getMyProfile();
      setSessionUser({
        userId: profile.userId,
        nickname: profile.username ?? profile.email,
        email: profile.email,
        profileImageUrl: profile.profileImageUrl,
      });
      router.replace('/');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-heading-base font-bold">테스트 계정 로그인</h1>
        <p className="text-body-base text-text-subtle">
          로컬 개발 전용입니다. 카카오 없이 테스트 계정으로 로그인합니다.
        </p>
      </div>
      <Button type="button" onClick={handleTestLogin} disabled={status === 'loading'} className="mx-auto">
        {status === 'loading' ? '로그인 중...' : '테스트 계정으로 로그인'}
      </Button>
      {status === 'error' && (
        <p className="text-body-sm text-text-error">로그인에 실패했습니다. 콘솔/네트워크를 확인하세요.</p>
      )}
    </div>
  );
};

export default TestLoginPage;
