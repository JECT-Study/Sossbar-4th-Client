'use client';

import { useRouter } from 'next/navigation';

import { LoginOverlay } from '@/shared/components/login-overlay';

export const LoginGate = () => {
  const router = useRouter();

  return <LoginOverlay onDismiss={() => router.back()} />;
};
