import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

/**
 * NOTE: 데이터가 신선하다고 판단되는 시간을 1분으로 설정합니다.
 */
const STALE_TIME = 60 * 1000;

/**
 * NOTE: 언마운트 시 메모리에 얼마나 남겨둘지 결정하는 시간을 5분으로 설정합니다.
 */
const GC_TIME = 60 * 1000 * 5;

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        retry: 0,
        throwOnError: true,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        shouldRedactErrors: () => {
          return false;
        },
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
  }
};
