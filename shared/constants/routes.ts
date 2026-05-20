export const ROUTES = {
  LOGIN: '/login',
  MY_PAGE: '/mypage',
  PRIVACY_POLICY: '/policies/privacy-policy',
  PROFILE: (userId: string | number) => `/profile/${userId}`,
  PROJECT: (projectId: string | number) => `/project/${projectId}`,
  TERMS_OF_SERVICE: '/policies/terms-of-service',
} as const;
