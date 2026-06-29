import Image from 'next/image';

const PREVIEW_CARD_CLASS =
  'bg-element-gray-light relative h-[260px] w-full shrink-0 overflow-hidden rounded-md shadow-[0px_8px_24px_rgba(0,0,0,0.1)] lg:w-[352px]';

const STEP3_PREVIEW_CARD_CLASS =
  'relative h-[260px] w-full shrink-0 overflow-hidden rounded-md shadow-[0px_4px_16px_rgba(96,96,96,0.3)] lg:w-[352px]';

type HowItWorksStepPreviewProps = {
  variant: 'step1' | 'step2' | 'step3';
  title: string;
};

export const HowItWorksStepPreview = ({ variant, title }: HowItWorksStepPreviewProps) => {
  if (variant === 'step1') {
    return (
      <div className={PREVIEW_CARD_CLASS}>
        <div className="absolute top-[91px] left-[-84px] h-[245px] w-[404px] overflow-hidden rounded-[22px]">
          <div className="absolute top-[-8.43%] left-0 h-[110.37%] w-[118.99%]">
            <Image
              src="/home-renewal/how-it-works-step1-screen.png"
              alt={`${title} 화면 예시`}
              fill
              className="object-cover object-top"
              sizes="404px"
            />
          </div>
        </div>
        <div aria-hidden className="absolute top-[52px] left-[217px] size-[130px] rounded-full bg-black/15" />
        <div className="absolute top-[77px] left-[217px] h-[104px] w-[109px]">
          <Image
            src="/home-renewal/how-it-works-step1-magnifier-glass.png"
            alt=""
            fill
            className="object-contain"
            sizes="109px"
          />
        </div>
      </div>
    );
  }

  if (variant === 'step2') {
    return (
      <div className={PREVIEW_CARD_CLASS}>
        <div className="absolute top-1/2 left-1/2 h-[174px] w-[318px] -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/home-renewal/how-it-works-step2-card.png"
            alt={`${title} 화면 예시`}
            fill
            className="object-cover"
            sizes="318px"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={STEP3_PREVIEW_CARD_CLASS}>
      <div className="absolute inset-0">
        <Image
          src="/home-renewal/how-it-works-step3-profile.png"
          alt={`${title} 화면 예시`}
          fill
          className="object-cover object-top"
          sizes="352px"
        />
      </div>
    </div>
  );
};
