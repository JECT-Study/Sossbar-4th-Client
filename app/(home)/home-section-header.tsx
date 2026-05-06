import { cn } from '@/shared/lib/cn';

interface HomeSectionHeaderProps {
  badge: string;
  heading: string;
  description?: string;
  className?: string;
  headingClassName?: string;
}

export const HomeSectionHeader = ({
  badge,
  heading,
  description,
  className,
  headingClassName,
}: HomeSectionHeaderProps) => {
  return (
    <div className={cn('flex w-full flex-col items-center', className)}>
      <div className="text-element-primary bg-button-secondary-fill box-border flex h-[32px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] px-4 text-center text-[14px] leading-none font-normal whitespace-nowrap">
        {badge}
      </div>
      <h2
        className={cn('text-text-basic mt-2 w-full text-center text-[48px] leading-[150%] font-bold', headingClassName)}
      >
        {heading}
      </h2>
      {description ? (
        <p className="text-text-subtle mt-2 w-full text-center text-[20px] leading-[150%] font-normal">{description}</p>
      ) : null}
    </div>
  );
};
