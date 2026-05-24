'use client';

import type { ChangeEventHandler, FocusEventHandler, Ref } from 'react';

import { useRef, useState } from 'react';

import { useComposedRefs } from '@/shared/hooks/use-composed-refs';

interface TextareaInteractionParams {
  defaultValue?: string;
  ref?: Ref<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
}

export const useTextareaInteraction = ({
  ref,
  defaultValue = '',
  onChange,
  onFocus,
  onBlur,
}: TextareaInteractionParams) => {
  const [valueLength, setValueLength] = useState(defaultValue.length);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mergedRef = useComposedRefs(textareaRef, ref);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setValueLength(event.target.value.length);
    onChange?.(event);
  };

  const handleFocus: FocusEventHandler<HTMLTextAreaElement> = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return {
    valueLength,
    isFocused,
    mergedRef,
    handleChange,
    handleFocus,
    handleBlur,
  };
};
