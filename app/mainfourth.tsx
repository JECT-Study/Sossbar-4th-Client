import Image from 'next/image';

export const Fourth = () => {
  return (
    <section id="main-fourth" className="overflow-hidden bg-white pt-[120px] pb-0">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
        <div className="flex h-[150px] w-full flex-col items-center">
          <div className="text-element-primary bg-button-secondary-fill box-border flex h-[32px] w-[93px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] text-center text-[14px] leading-none font-normal whitespace-nowrap">
            메인페이지
          </div>
          <h2 className="text-text-basic mt-2 h-[72px] w-full text-center text-[48px] leading-[150%] font-bold">
            Softskill을 한 눈에!
          </h2>
          <p className="text-text-subtle mt-2 h-[30px] w-full text-center text-[20px] leading-[150%] font-normal">
            각각의 프로젝트 동료에게 받은 후기와 소프트 스킬을 한 페이지에 가독성 좋게!
          </p>
        </div>

        <div className="relative mt-8 flex w-full justify-center">
          <div
            className="pointer-events-none absolute top-[16px] left-1/2 z-0 h-[860px] w-[1920px] -translate-x-1/2 overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
            }}
          >
            <Image
              src="/mainforth_radial.svg"
              alt=""
              width={1920}
              height={766}
              className="absolute top-[80px] left-1/2 h-[766px] w-[1920px] -translate-x-1/2 opacity-100 mix-blend-multiply select-none"
            />
            <Image
              src="/mainforth_radial.svg"
              alt=""
              width={2219}
              height={743}
              className="absolute top-[320px] left-[-880px] h-[743px] w-[2219px] opacity-55 mix-blend-multiply select-none"
            />
            <Image
              src="/mainforth_radial.svg"
              alt=""
              width={2219}
              height={725}
              className="absolute top-[340px] left-[620px] h-[725px] w-[2219px] opacity-55 mix-blend-multiply select-none"
            />
          </div>

          <div className="relative z-10 flex w-full justify-center">
            <div className="relative h-[829px] w-[1216px] max-w-[1216px]">
              <Image
                src="/mainforth_screen.svg"
                alt=""
                width={922}
                height={550}
                className="pointer-events-none absolute top-[41px] left-1/2 z-20 h-[550px] w-[922px] -translate-x-1/2 select-none"
                priority
              />
              <Image
                src="/mainforth_tv.svg"
                alt="Softskill 화면이 표시된 노트북 목업"
                width={1216}
                height={829}
                className="pointer-events-none relative z-10 h-[829px] w-[1216px] select-none"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
