import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/shared/components/button/button';
import { PageContainer } from '@/shared/components/page-container';
import { cn } from '@/shared/lib/cn';

/** 로고(178px)와 시각 높이 맞춤 + 윗줄 정렬(text-box-trim으로 폰트 상단 여백 제거) */
const NOT_FOUND_DIGIT_WRAPPER = 'inline-flex shrink-0 items-start justify-center';
const NOT_FOUND_DIGIT_CLASS =
  'text-text-basic text-[14.5rem] leading-none font-bold [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]';

const NotFound = () => {
  return (
    <section className="flex flex-1 flex-col items-center py-[180px]">
      <PageContainer className="flex w-full flex-col items-center gap-4 py-10">
        <div className="flex items-start justify-center gap-4" aria-label="404">
          <span className={NOT_FOUND_DIGIT_WRAPPER} aria-hidden>
            <span className={NOT_FOUND_DIGIT_CLASS}>4</span>
          </span>
          <Image
            src="/Sossbar-logo2.svg"
            alt=""
            width={182}
            height={178}
            className="h-[178px] w-[182px] shrink-0"
            priority
          />
          <span className={NOT_FOUND_DIGIT_WRAPPER} aria-hidden>
            <span className={NOT_FOUND_DIGIT_CLASS}>4</span>
          </span>
        </div>

        <h1 className="text-heading-xl text-text-basic text-center leading-normal font-bold whitespace-nowrap">
          Page not found
        </h1>

        <div className="flex w-full flex-col items-center gap-4">
          <p className="text-body-xl text-text-subtle text-center leading-normal font-medium">
            <span className="block whitespace-nowrap">이런, 뭔가 잘못됐어요!</span>
            <span className="block whitespace-nowrap">이 페이지가 더 이상 존재하지 않아요.</span>
          </p>

          <Button
            asChild
            variant="primary"
            size="large"
            className={cn('mx-auto h-14 min-w-[91px] shrink-0 self-center px-7')}
          >
            <Link href="/">홈으로 가기</Link>
          </Button>
        </div>
      </PageContainer>
    </section>
  );
};

export default NotFound;
