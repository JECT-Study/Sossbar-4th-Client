import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

// eslint-disable-next-line import/no-default-export
export default nextConfig;
