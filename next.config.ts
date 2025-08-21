import type { NextConfig } from "next";
import withVercelToolbar from '@vercel/toolbar/plugins/next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default withVercelToolbar()(nextConfig);
