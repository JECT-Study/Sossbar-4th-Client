import clsx from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-base',
            'display-sm',
            'heading-2xl',
            'heading-xl',
            'heading-lg',
            'heading-base',
            'heading-sm',
            'heading-xs',
            'body-xl',
            'body-lg',
            'body-base',
            'body-sm',
            'body-xs',
            'detail-lg',
            'detail-base',
            'detail-sm',
            'detail-xs',
          ],
        },
      ],
      'text-color': [
        {
          text: [
            'text-basic',
            'text-basic-inverse',
            'text-subtle',
            'text-disabled',
            'text-primary',
            'text-secondary',
            'text-tertiary',
            'text-error',
            'text-warning',
            'text-success',
          ],
        },
      ],
    },
  },
});

export const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(classes));
};
