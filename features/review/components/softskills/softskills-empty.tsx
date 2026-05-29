import type { ReactNode } from 'react';

type SoftskillsEmptyProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const SoftskillsEmpty = ({ title, description, action }: SoftskillsEmptyProps) => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
      <div aria-hidden className="bg-bg-gray-subtle flex size-10 items-center justify-center rounded-full">
        <span className="text-heading-base text-text-subtler font-bold">!</span>
      </div>
      <p className="text-heading-base text-text-subtler font-bold">{title}</p>
      {description ? <p className="text-heading-sm text-text-subtler font-medium">{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
};
