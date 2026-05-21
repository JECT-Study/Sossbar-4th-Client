'use client';

import type { ChangeEventHandler, FocusEventHandler, Ref } from 'react';

import { useRef, useState } from 'react';

import { useMergeRef } from '@/shared/hooks/use-merge-ref';

interface InputInteractionParams {
  ref?: Ref<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export const useInputInteraction = ({ ref, onChange, onFocus, onBlur }: InputInteractionParams) => {
  const [valueLength, setValueLength] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mergedRef = useMergeRef(inputRef, ref);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValueLength(event.target.value.length);
    onChange?.(event);
  };

  const handleFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const clearInput = () => {
    if (!inputRef.current) {
      return;
    }
    // React가 관리하는 value를 우회해 native setter로 초기화해야 RHF의 onChange가 정상 발화됨
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(inputRef.current, '');
    inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return {
    valueLength,
    isFocused,
    mergedRef,
    handleChange,
    handleFocus,
    handleBlur,
    clearInput,
  };
};
