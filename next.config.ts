import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

    return {
      // 카카오 Redirect URI가 /api/v1/login/kakao 인 경우, 브라우저 진입만 콜백 페이지로 연결
      beforeFiles: [
        {
          source: '/api/v1/login/kakao',
          destination: '/login/kakao',
        },
      ],
      afterFiles: [
        {
          source: '/api/v1/:path*',
          destination: `${apiBase}/api/v1/:path*`,
        },
      ],
    };
  },
  turbopack: {
    // Project root must be this app directory; `..` breaks `@/` and `shared/...` resolution on Linux CI.
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

// eslint-disable-next-line import/no-default-export
export default nextConfig;
