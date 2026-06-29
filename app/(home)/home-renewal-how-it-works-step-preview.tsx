import Image from 'next/image';

const PREVIEW_CARD_CLASS =
  'bg-element-gray-light relative h-[300px] w-full shrink-0 overflow-hidden rounded-md shadow-[0px_8px_24px_rgba(0,0,0,0.1)] lg:w-[554px]';

const STEP3_PREVIEW_CARD_CLASS =
  'relative h-[300px] w-full shrink-0 overflow-hidden rounded-md shadow-[0px_4px_16px_rgba(96,96,96,0.3)] lg:w-[554px]';

type HowItWorksStepPreviewProps = {
  variant: 'step1' | 'step2' | 'step3';
  title: string;
};

export const HowItWorksStepPreview = ({ variant, title }: HowItWorksStepPreviewProps) => {
  if (variant === 'step1') {
    return (
      <div className={PREVIEW_CARD_CLASS}>
        <div className="absolute top-[78px] left-[-118px] h-[380px] w-[614px] overflow-hidden rounded-[22px]">
          <div className="relative h-full w-full">
            <div className="absolute top-[-8.43%] left-0 h-[110.37%] w-[118.99%]">
              <Image
                src="/home-renewal/how-it-works-step1-screen.png"
                alt={`${title} 화면 예시`}
                fill
                className="object-cover object-top"
                sizes="614px"
              />
            </div>
          </div>
        </div>
        <div aria-hidden className="absolute top-[18px] left-[339px] size-[200px] rounded-full bg-black/15" />
        <div className="absolute top-[56.67px] left-[339px] h-[161.316px] w-[165.093px]">
          <Image
            src="/home-renewal/how-it-works-step1-magnifier-glass.png"
            alt=""
            fill
            className="object-contain"
            sizes="165px"
          />
        </div>
      </div>
    );
  }

  if (variant === 'step2') {
    return (
      <div className={PREVIEW_CARD_CLASS}>
        <div className="absolute top-6 left-1/2 h-[276px] w-[506px] -translate-x-1/2">
          <Image
            src="/home-renewal/how-it-works-step2-card.png"
            alt={`${title} 화면 예시`}
            fill
            className="object-cover"
            sizes="506px"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={STEP3_PREVIEW_CARD_CLASS}>
      <Image
        src="/home-renewal/how-it-works-step3-profile.png"
        alt={`${title} 화면 예시`}
        fill
        className="object-cover object-left-top"
        sizes="554px"
      />
    </div>
  );
};
