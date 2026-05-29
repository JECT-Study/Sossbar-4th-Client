import type { ReactNode } from 'react';

type ReviewListEmptyProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const ReviewListEmpty = ({ title, description, action }: ReviewListEmptyProps) => {
  return (
    <section className="border-border-gray flex h-[544px] w-full flex-col items-center justify-center gap-6 rounded-2xl border bg-white">
      <div aria-hidden className="bg-bg-gray-subtle flex size-10 items-center justify-center rounded-full">
        <span className="text-heading-base text-text-subtler font-bold">!</span>
      </div>
      <p className="text-heading-base text-text-subtler font-bold">{title}</p>
      {description ? <p className="text-heading-sm text-text-subtler font-medium">{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </section>
  );
};
