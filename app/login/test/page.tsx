'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getMyProfile } from '@/features/auth/fetchers';
import { testAccountLogin } from '@/features/auth/test-account/fetchers';
import { Button } from '@/shared/components/button/button';
import { setAuthToken } from '@/shared/lib/auth-token';
import { setSessionUser } from '@/shared/lib/session-user';

const TestLoginPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTestLogin = async () => {
    setStatus('loading');
    setErrorMessage(null);
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
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-heading-base font-bold">테스트 계정 로그인</h1>
        <p className="text-body-base text-text-subtle">카카오 없이 테스트 계정으로 로그인합니다.</p>
      </div>
      <Button type="button" onClick={handleTestLogin} disabled={status === 'loading'} className="mx-auto">
        {status === 'loading' ? '로그인 중...' : '테스트 계정으로 로그인'}
      </Button>
      {status === 'error' && (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-body-sm text-text-error">로그인에 실패했습니다.</p>
          {errorMessage !== null && errorMessage !== '' && (
            <p className="text-body-sm text-text-error">{errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TestLoginPage;
