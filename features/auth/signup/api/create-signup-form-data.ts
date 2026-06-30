import type { SignupPayload } from '../types';

export const createSignupFormData = ({
  name,
  bio,
  requiredAgree,
  profileImage,
  positions,
  links,
}: SignupPayload): FormData => {
  const formData = new FormData();

  formData.append(
    'onboarding',
    new Blob(
      [
        JSON.stringify({
          username: name,
          bio,
          defaultPositions: positions,
          links,
          requiredAgree,
          // marketingAgree는 별도 수집 없이 전송 시점에만 true로 고정
          marketingAgree: true,
        }),
      ],
      { type: 'application/json' },
    ),
  );

  if (profileImage) {
    formData.append('profileImage', profileImage, profileImage.name);
  } else {
    formData.append('profileImage', new Blob([]), '');
  }

  return formData;
};
