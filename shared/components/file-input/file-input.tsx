'use client';

import type { ComponentProps } from 'react';

import { FileUploadIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/cn';

import { useFileInput } from './use-file-input';
import { Button } from '../button';

export type FileInputProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange'> & {
  value?: File | null;
  onChange?: (file: File | null) => void;
  label?: string;
};

export const FileInput = ({
  className,
  value = null,
  onChange,
  disabled,
  label = '파일 업로드하기',
  ...props
}: FileInputProps) => {
  const { inputRef, inputId, openPicker, handleFileChange } = useFileInput({ disabled, onChange });

  return (
    <div className={cn('flex w-full max-w-[360px] flex-col', className)}>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        onChange={handleFileChange}
        aria-hidden
        {...props}
      />

      {value === null ? (
        <Button
          type="button"
          variant="tertiary"
          size="small"
          onClick={openPicker}
          className="border-button-tertiary-fill-pressed border px-4 py-2.5"
          leftIcon={<FileUploadIcon className="size-5 shrink-0" aria-hidden />}
        >
          {label}
        </Button>
      ) : (
        <Button
          type="button"
          variant="tertiary"
          size="small"
          onClick={openPicker}
          className="border-button-tertiary-fill-pressed border px-4 py-2.5"
        >
          {value.name}
        </Button>
      )}
    </div>
  );
};
