import Image from 'next/image';

const PREVIEW_CARD_CLASS =
  'relative h-[260px] w-full shrink-0 overflow-hidden rounded-md shadow-[0px_8px_24px_rgba(0,0,0,0.1)] lg:w-[352px]';

const STEP_PREVIEW_CONFIG = {
  step1: { src: '/landing_step_1.png', scale: 1.32 },
  step2: { src: '/landing_step_2.png', scale: 1.28 },
  step3: { src: '/landing_step_3.png', scale: 1.3 },
} as const;

type HomeHowItWorksStepPreviewProps = {
  variant: keyof typeof STEP_PREVIEW_CONFIG;
  title: string;
};

export const HomeHowItWorksStepPreview = ({ variant, title }: HomeHowItWorksStepPreviewProps) => {
  const { src, scale } = STEP_PREVIEW_CONFIG[variant];

  return (
    <div className={PREVIEW_CARD_CLASS}>
      <Image
        src={src}
        alt={`${title} 화면 예시`}
        fill
        className="origin-center object-cover object-center"
        style={{ transform: `scale(${scale})` }}
        sizes="352px"
      />
    </div>
  );
};
