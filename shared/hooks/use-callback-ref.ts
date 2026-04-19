import { useCallback, useLayoutEffect, useRef } from 'react';

export function useCallbackRef<T extends (...args: never[]) => unknown>(
  callback: T | undefined,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current?.(...args) as ReturnType<T> | undefined;
  }, []);
}
