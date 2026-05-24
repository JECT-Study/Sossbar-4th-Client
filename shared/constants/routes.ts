export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGIN_KAKAO_CALLBACK: '/login/kakao',
  SIGNUP: '/signup',
  MY_PAGE: '/mypage',
  PRIVACY_POLICY: '/policies/privacy-policy',
  PROFILE_EXAMPLES: '/profile-examples',
  PROFILE: (userId: string | number) => `/profile/${userId}`,
  PROJECT: (projectId: string | number) => `/project/${projectId}`,
  TERMS_OF_SERVICE: '/policies/terms-of-service',
} as const;
