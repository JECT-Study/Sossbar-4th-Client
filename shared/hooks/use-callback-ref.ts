import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * 최신 콜백을 참조하면서도, 참조가 고정된 함수를 반환하는 훅입니다.
 *
 * @param callback 실행할 원본 콜백입니다. `undefined`일 수 있습니다.
 * @returns 참조가 고정된 콜백 함수를 반환합니다.
 * 반환된 함수는 호출 시점의 최신 `callback`을 실행하며, `callback`이 없으면 `undefined`를 반환합니다.
 *
 * @example
 * const onClick = useCallbackRef((value: string) => {
 *   return value.length;
 * });
 */
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
