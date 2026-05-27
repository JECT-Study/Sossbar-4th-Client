export const isServerMockEnabled = () => {
  if (process.env.NEXT_PUBLIC_MSW === 'true') {
    return true;
  }

  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW !== 'false';
};

declare global {
  var __MSW_SERVER_STARTED__: boolean | undefined;
}

export const initMockServer = async () => {
  if (!isServerMockEnabled()) {
    return;
  }

  if (globalThis.__MSW_SERVER_STARTED__) {
    return;
  }

  const { server } = await import('./server');
  server.listen({ onUnhandledRequest: 'bypass' });
  globalThis.__MSW_SERVER_STARTED__ = true;
};
