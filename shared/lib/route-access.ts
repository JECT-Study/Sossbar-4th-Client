/** OG 크롤러·초대/후기 링크 등 로그인 없이 접근해야 하는 경로 */
export const isPublicShareRoute = (pathname: string, searchParams: URLSearchParams): boolean => {
  if (pathname === '/projects' && searchParams.has('invite')) {
    return true;
  }

  if (pathname === '/reviews/new' && searchParams.has('projectId') && searchParams.has('revieweeId')) {
    return true;
  }

  return false;
};

const CRAWLER_UA_PATTERNS = [
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'kakaotalk',
  'googlebot',
  'bingbot',
] as const;

export const isCrawlerUserAgent = (userAgent: string | null): boolean => {
  const ua = (userAgent ?? '').toLowerCase();
  return CRAWLER_UA_PATTERNS.some((pattern) => ua.includes(pattern));
};

/** proxy → layout에 pathname·query 전달용 헤더 */
export const ROUTE_PATHNAME_HEADER = 'x-pathname';
export const ROUTE_SEARCH_HEADER = 'x-search';
