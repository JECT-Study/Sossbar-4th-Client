import Link from 'next/link';

import { Checkbox } from '@/shared/components/checkbox';

import type { AGREEMENTS } from '../signup.constants';

interface Props {
  agreement: (typeof AGREEMENTS)[number];
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const AgreementItem = ({ agreement, checked, onChange }: Props) => (
  <label className="flex cursor-pointer items-center gap-3">
    <Checkbox checked={checked} onCheckedChange={(value) => onChange(value === true)} />
    <span className="text-text-basic text-[14px]">
      {'url' in agreement ? (
        <>
          {agreement.required ? '(필수)' : '(선택)'}{' '}
          <Link
            href={agreement.url}
            className="font-medium underline underline-offset-2"
            onClick={(event) => event.stopPropagation()}
          >
            {agreement.linkLabel}
          </Link>
          {agreement.suffix}
        </>
      ) : (
        <>
          {agreement.required ? '(필수)' : '(선택)'} {agreement.label}
        </>
      )}
    </span>
  </label>
);
