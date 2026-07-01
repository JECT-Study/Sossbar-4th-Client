export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGIN_KAKAO_CALLBACK: '/login/kakao',
  SIGNUP: '/signup',
  MY_PAGE: '/mypage',
  MY_SOSS: '/my-soss',
  PRIVACY_POLICY: '/policies/privacy-policy',
  PROFILE_EXAMPLES: '/profile-examples',
  PROFILE: (userLink: string) => `/profile/${userLink}`,
  PROJECT: (userLink: string, projectId: string | number) => `/profile/${userLink}/project/${projectId}`,
  TERMS_OF_SERVICE: '/policies/terms-of-service',
} as const;
