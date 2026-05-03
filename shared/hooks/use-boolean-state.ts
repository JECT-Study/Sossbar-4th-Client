import { useCallback, useState } from 'react';

/**
 * boolean 상태와 상태 변경 핸들러를 제공하는 훅입니다.
 *
 * @param defaultValue 초기 boolean 값입니다. 기본값은 `false`입니다.
 * @returns `[boolean, setTrue, setFalse, toggle]` 튜플을 반환합니다.
 * - `boolean`: 현재 상태
 * - `setTrue`: 상태를 `true`로 변경
 * - `setFalse`: 상태를 `false`로 변경
 * - `toggle`: 상태를 반전
 *
 * @example
 * const [isOpen, open, close, toggle] = useBooleanState(false);
 */

export const useBooleanState = (defaultValue: boolean = false) => {
  const [boolean, setBoolean] = useState(defaultValue);

  const setTrue = useCallback(() => setBoolean(true), []);
  const setFalse = useCallback(() => setBoolean(false), []);
  const toggle = useCallback(() => setBoolean((prevState) => !prevState), []);

  return [boolean, setTrue, setFalse, toggle] as const;
};
