export const BIO_MAX_LENGTH = 50;

export const NAME_MAX_LENGTH = 20;

export const AGREEMENTS = [
  { key: 'age', label: '만 14세 이상입니다.', required: true },
  {
    key: 'terms',
    linkLabel: '서비스 이용약관',
    suffix: '에 동의합니다.',
    required: true,
    url: '/policies/terms-of-service',
  },
  {
    key: 'privacy',
    linkLabel: '개인정보 수집/이용',
    suffix: '에 동의합니다.',
    required: true,
    url: '/policies/privacy-policy',
  },
  {
    key: 'marketing',
    label: '마케팅 수신・홍보 목적의 개인정보 수집 및 이용에 동의합니다.',
    required: false,
  },
] as const;
