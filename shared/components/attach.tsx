'use client';

import type { ChangeEvent, ComponentProps } from 'react';

import { useId, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

const FileAttachLeadIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      className={cn('shrink-0 text-(--color-icon-primary)', className)}
      aria-hidden
    >
      <rect x={2.5} y={3.5} width={15} height={13} rx={1.5} fill="none" stroke="currentColor" strokeWidth={1.25} />
      <path
        d="M6 12.5 9 9.5l2 2 3.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={13.5} cy={6.5} r={1} fill="currentColor" />
    </svg>
  );
};

export type FileAttachProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange'> & {
  onChange?: (file: File | null) => void;
  /** 기본: 파일 첨부하기 */
  label?: string;
};

export const FileAttach = ({ className, onChange, disabled, label = '파일 첨부하기', ...props }: FileAttachProps) => {
  const generatedId = useId();
  const inputId = `file-attach-${generatedId}`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openPicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    e.target.value = '';
    setSelectedFile(next);
    onChange?.(next);
  };

  return (
    <div className={cn('flex w-full max-w-[360px] flex-col', className)}>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        onChange={handleChange}
        aria-hidden
        {...props}
      />

      {selectedFile === null ? (
        <button
          type="button"
          disabled={disabled}
          onClick={openPicker}
          className={cn(
            'border-button-secondary-border inline-flex h-10 w-fit shrink-0 items-center justify-center gap-1 rounded-md border',
            'bg-button-secondary-fill text-body-base text-text-primary px-4 py-0 font-medium',
            'transition-colors',
            'hover:bg-button-secondary-fill-hover',
            'focus-visible:bg-button-secondary-fill-hover focus-visible:outline-none',
            'active:bg-button-secondary-fill-pressed',
            disabled &&
              'bg-button-disabled-fill text-text-disabled hover:bg-button-disabled-fill cursor-not-allowed border-none',
          )}
          aria-controls={inputId}
        >
          <FileAttachLeadIcon />
          {label}
        </button>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={openPicker}
          className={cn(
            'box-border flex h-12 w-full cursor-pointer items-center rounded-md border border-(--color-border-gray)',
            'bg-(--color-surface-gray-subtler) px-4 py-0 text-left transition-[border-color,box-shadow,background-color]',
            disabled && 'pointer-events-none cursor-not-allowed',
          )}
          aria-label={`첨부 파일: ${selectedFile.name}`}
        >
          <span className="text-body-base min-w-0 flex-1 truncate text-start leading-normal text-(--color-text-subtle)">
            {selectedFile.name}
          </span>
        </button>
      )}
    </div>
  );
};
