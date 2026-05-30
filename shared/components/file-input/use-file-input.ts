'use client';

import type { ChangeEventHandler } from 'react';

import { useId, useRef } from 'react';

interface UseFileInputParams {
  disabled?: boolean;
  onChange?: (file: File | null) => void;
}

export const useFileInput = ({ disabled, onChange }: UseFileInputParams) => {
  const generatedId = useId();
  const inputId = `file-input-${generatedId}`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    event.currentTarget.value = '';
    onChange?.(selectedFile);
  };

  return { inputRef, inputId, openPicker, handleFileChange };
};
