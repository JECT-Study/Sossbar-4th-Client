import Image from 'next/image';

const SCREEN_BLACK_BORDER_SRC = '/Screen Black Border.svg';

const SCREEN_LEFT = 81;
const SCREEN_TOP = 56;
const SCREEN_CONTENT_OFFSET_TOP = 20;
const SCREEN_WIDTH = 433;
const SCREEN_HEIGHT = 244;
const BORDER_WIDTH = 451.64;
const BORDER_HEIGHT = 308.56;
const BEZEL_LEFT = (BORDER_WIDTH - SCREEN_WIDTH) / 2;
const BEZEL_TOP = 18;

type HowItWorksDevicePreviewProps = {
  imageSrc?: string | null;
  title: string;
};

export const HowItWorksDevicePreview = ({ imageSrc, title }: HowItWorksDevicePreviewProps) => {
  return (
    <div className="bg-surface-gray-subtler relative h-[300px] w-full shrink-0 overflow-hidden rounded-md lg:w-[595px]">
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: SCREEN_LEFT - BEZEL_LEFT,
          top: SCREEN_TOP - BEZEL_TOP,
          width: BORDER_WIDTH,
          height: BORDER_HEIGHT,
        }}
      >
        <Image src={SCREEN_BLACK_BORDER_SRC} alt="" fill className="object-fill" sizes="452px" />
      </div>

      <div
        className="absolute overflow-hidden rounded-[14px]"
        style={{
          left: SCREEN_LEFT,
          top: SCREEN_TOP + SCREEN_CONTENT_OFFSET_TOP,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        }}
      >
        {imageSrc ? (
          <div className="relative -top-[0.05%] h-[101.84%] w-full">
            <Image src={imageSrc} alt={`${title} 화면 예시`} fill className="object-cover object-top" sizes="433px" />
          </div>
        ) : (
          <div className="size-full bg-[#d9d9d9]" />
        )}
      </div>
    </div>
  );
};
