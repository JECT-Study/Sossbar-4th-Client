import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * 클라이언트 hydration이 완료됐는지 여부를 반환한다.
 *
 * SSR과 hydration 직전에는 `false`, hydration 이후에는 `true`를 반환한다.
 * Radix UI처럼 `useId` 기반 id를 생성하는 컴포넌트의 hydration mismatch를 피할 때 사용한다.
 */
export const useIsHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
