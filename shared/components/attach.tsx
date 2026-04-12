'use client';

import type { ChangeEvent, MutableRefObject } from 'react';

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

const FileAttachLeadIcon = ({ className }: { className?: string }) => {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" className={cn('text-text-primary shrink-0', className)} aria-hidden>
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

export type FileAttachProps = {
  className?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  label?: string;
  name?: string;
};

export const FileAttach = forwardRef<HTMLInputElement, FileAttachProps>(function FileAttach(
  { className, value, onChange, accept, disabled, label = '파일 첨부하기', name },
  ref,
) {
  const generatedId = useId();
  const inputId = `file-attach-${generatedId}`;
  const innerInputRef = useRef<HTMLInputElement | null>(null);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      innerInputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<HTMLInputElement | null>).current = node;
      }
    },
    [ref],
  );

  const isControlled = value !== undefined;
  const [uncontrolledFile, setUncontrolledFile] = useState<File | null>(null);
  const selectedFile = isControlled ? (value ?? null) : uncontrolledFile;

  useEffect(() => {
    if (value === null && innerInputRef.current) {
      innerInputRef.current.value = '';
    }
  }, [value]);

  const openPicker = () => {
    if (disabled) {
      return;
    }
    innerInputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    e.target.value = '';
    if (!isControlled) {
      setUncontrolledFile(next);
    }
    onChange?.(next);
  };

  const hasFile = selectedFile != null;

  return (
    <div className={cn('flex w-full max-w-[360px] flex-col', className)}>
      <input
        id={inputId}
        ref={setInputRef}
        type="file"
        name={name}
        accept={accept}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        onChange={handleChange}
        aria-hidden
      />

      {!hasFile ? (
        <button
          type="button"
          disabled={disabled}
          onClick={openPicker}
          className={cn(
            'border-button-secondary-border box-border inline-flex h-10 w-fit shrink-0 items-center justify-center gap-1 rounded-md border',
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
});
