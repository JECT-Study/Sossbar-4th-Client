'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ImagePreviewState {
  file: File | null;
  previewUrl: string | null;
}

export const useImagePreview = () => {
  const urlRef = useRef<string | null>(null);
  const [{ file, previewUrl }, setState] = useState<ImagePreviewState>({ file: null, previewUrl: null });

  const onChange = useCallback((nextFile: File | null) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    const url = nextFile ? URL.createObjectURL(nextFile) : null;
    urlRef.current = url;
    setState({ file: nextFile, previewUrl: url });
  }, []);

  useEffect(
    () => () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    },
    [],
  );

  return { file, previewUrl, onChange };
};
