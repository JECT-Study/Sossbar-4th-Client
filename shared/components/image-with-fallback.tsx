'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type ImageWithFallbackProps = Omit<ImageProps, 'src' | 'onError'> & {
  src: string | null | undefined;
  fallbackSrc: string;
};

export const ImageWithFallback = ({ src, fallbackSrc, ...restProps }: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);
  const imageSrc = src && !hasError ? src : fallbackSrc;

  return <Image {...restProps} src={imageSrc} onError={() => setHasError(true)} />;
};
