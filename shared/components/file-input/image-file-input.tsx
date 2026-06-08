'use client';

import { useEffect, useId } from 'react';

import { ErrorMessage } from '@/shared/components/error-message';
import { cn } from '@/shared/lib/cn';

import type { FileInputProps } from './file-input';

import { FileInput } from './file-input';
import { useImagePreview } from './use-image-preview';

export type ImageFileInputProps = FileInputProps & {
  errorMessage?: string;
  previewAlt?: string;
  previewClassName?: string;
};

export const ImageFileInput = ({
  className,
  value = null,
  onChange,
  accept = 'image/*',
  label = '이미지 업로드하기',
  errorMessage,
  previewAlt = '선택한 이미지 미리보기',
  previewClassName,
  ...props
}: ImageFileInputProps) => {
  const errorMessageId = useId();
  const { previewUrl, onChange: setPreviewFile } = useImagePreview();

  useEffect(() => {
    setPreviewFile(value);
  }, [setPreviewFile, value]);

  return (
    <div
      className={cn('flex w-full max-w-[360px] flex-col', className)}
      aria-describedby={errorMessage ? errorMessageId : undefined}
    >
      {value !== null && previewUrl !== null ? (
        <img
          className={cn('mb-2 block size-25 rounded-2xl object-cover', previewClassName)}
          src={previewUrl}
          alt={previewAlt}
        />
      ) : null}
      {errorMessage ? (
        <ErrorMessage id={errorMessageId} className="static mt-2">
          {errorMessage}
        </ErrorMessage>
      ) : null}
      <FileInput {...props} className="max-w-full" value={null} onChange={onChange} label={label} accept={accept} />
    </div>
  );
};
