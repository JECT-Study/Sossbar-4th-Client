'use client';

import { useEffect, useState, type ReactNode } from 'react';
type MswProviderProps = {
  children: ReactNode;
};

/**
 * MSW worker는 비동기로 시작됩니다. 시작 전에 `fetch`가 나가면 Next에 없는 `/api/v1/*`로
 * 그대로 전달되어 404가 납니다. worker가 준비된 뒤에만 자식을 렌더링합니다.
 */
export const MswProvider = ({ children }: MswProviderProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import('@/mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
        if (!cancelled) {
          setReady(true);
        }
      }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div
        className="text-body-sm text-text-subtle flex min-h-[40vh] flex-col items-center justify-center"
        aria-busy="true"
        aria-live="polite"
      >
        개발 목 서버 준비 중…
      </div>
    );
  }

  return children;
};
