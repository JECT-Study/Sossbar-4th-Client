import type { Dispatch, SetStateAction } from 'react';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useCallbackRef } from './use-callback-ref';

interface UseControllableStateParams<T> {
  prop?: T;
  defaultProp: T;
  onChange?: (prop: T) => void;
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFunction = (value: unknown): value is (...args: any[]) => any => typeof value === 'function';
