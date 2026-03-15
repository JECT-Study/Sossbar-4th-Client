'use client';

import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';

const MswProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = async () => {
      const { worker } = await import('@/shared/api/mocks/browser');
      await worker.start({ quiet: true });
      setReady(true);
    };
    start();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-label="로딩 중">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return children;
};

export { MswProvider };
