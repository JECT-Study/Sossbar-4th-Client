import Image from 'next/image';

import { Button } from '@/shared/components/button';
import { cn } from '@/shared/lib/cn';

type Props = {
  name: string;
  className?: string;
  onConfirm: () => void;
};

export const ModalType = ({ name, className, onConfirm }: Props) => {
  return (
    <div
      className={cn('h-[353px] w-[360px] rounded-2xl bg-white px-8 pt-6 pb-10 shadow-xl', className)}
      role="document"
    >
      <div className="flex flex-col items-center text-center">
        <div className="h-[120px] w-[120px]" aria-hidden="true">
          <Image src="/signup_image.svg" alt="" width={120} height={120} className="h-full w-full" />
        </div>

        <div className="mt-6 text-[20px] leading-snug font-bold text-(--color-text-basic)">
          <span className="text-(--color-text-primary)">{name || '회원'}</span>
          <span className="text-(--color-text-basic)">님</span>
          <br />
          가입이 완료되었습니다!
        </div>

        <p className="text-body-sm mt-2 font-normal text-(--color-text-basic)">협업 프로필을 공유해보세요!</p>

        <Button
          type="button"
          onClick={onConfirm}
          size="large"
          className="text-body-base mt-6 h-12 w-full max-w-[312px] rounded-xl font-semibold"
        >
          프로필 공유하러 가기
        </Button>
      </div>
    </div>
  );
};
