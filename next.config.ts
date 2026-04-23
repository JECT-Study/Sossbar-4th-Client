import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '..'),
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
