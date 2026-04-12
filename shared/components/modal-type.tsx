'use client';

type ModalTypeProps = {
  name: string;
  onConfirm: () => void;
};

/** 회원가입 완료 등 확인용 모달 본문 */
export const ModalType = ({ name, onConfirm }: ModalTypeProps) => {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <p className="text-center text-[18px] font-semibold text-(--color-text-primary)">환영합니다, {name}님!</p>
      <p className="mt-2 text-center text-[14px] text-(--color-text-basic)">회원가입이 완료되었습니다.</p>
      <button
        type="button"
        onClick={onConfirm}
        className="mt-6 w-full rounded-xl bg-(--color-button-primary-fill) py-3 text-[16px] font-semibold text-(--color-text-basic-inverse) transition-colors hover:bg-(--color-button-primary-fill-hover) active:bg-(--color-button-primary-fill-pressed)"
      >
        확인
      </button>
    </div>
  );
};
