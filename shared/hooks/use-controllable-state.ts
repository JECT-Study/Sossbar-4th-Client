import type { Dispatch, SetStateAction } from 'react';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useCallbackRef } from './use-callback-ref';

interface UseControllableStateParams<T> {
  prop?: T;
  defaultProp: T;
  onChange?: (prop: T) => void;
}

/**
 * 제어/비제어 패턴을 모두 지원하는 상태 훅입니다.
 *
 * @param params 상태 제어 옵션입니다.
 * @param params.prop 외부에서 제어하는 값입니다. 전달되면 제어 모드로 동작합니다.
 * @param params.defaultProp 비제어 모드에서 사용할 초기값입니다.
 * @param params.onChange 값이 변경될 때 호출되는 콜백입니다.
 * @returns `[value, setValue]` 튜플을 반환합니다.
 * - `value`: 현재 상태 값
 * - `setValue`: `SetStateAction<T>`를 받는 상태 변경 함수
 *
 * @example
 * const [open, setOpen] = useControllableState({
 *   prop: openProp,
 *   defaultProp: false,
 *   onChange: onOpenChange,
 * });
 */
export const useControllableState = <T>({ prop, defaultProp, onChange }: UseControllableStateParams<T>) => {
  const [uncontrolledProp, setUncontrolledProp, onChangeCallback] = useUncontrolledState({ defaultProp, onChange });

  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (nextValue) => {
      if (isControlled) {
        const value = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value !== prop) {
          onChangeCallback(value);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [prop, isControlled, onChangeCallback, setUncontrolledProp],
  );

  return [value, setValue] as const;
};

/**
 * 비제어 상태를 관리하고 값 변경 시 `onChange`를 호출하는 내부 훅입니다.
 */
const useUncontrolledState = <T>({
  defaultProp,
  onChange,
}: Pick<UseControllableStateParams<T>, 'defaultProp' | 'onChange'>): [
  T,
  Dispatch<SetStateAction<T>>,
  (next: T) => void,
] => {
  const [value, setValue] = useState<T>(defaultProp);
  const prevValueRef = useRef<T>(value);

  const onChangeCallback = useCallbackRef(onChange);

  useEffect(() => {
    const hasChanged = prevValueRef.current !== value;

    if (hasChanged) {
      onChangeCallback(value);
      prevValueRef.current = value;
    }
  }, [value, onChangeCallback]);

  return [value, setValue, onChangeCallback] as const;
};

/**
 * 전달된 값이 함수인지 확인하는 타입 가드입니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFunction = (value: unknown): value is (...args: any[]) => any => typeof value === 'function';
