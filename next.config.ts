import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

    return {
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
