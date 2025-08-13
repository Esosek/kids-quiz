import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '', // Leave empty if using default HTTPS port (443)
        pathname: '/v0/b/kids-quiz-c9ae5.firebasestorage.app/o/**',
      },
    ],
  },
}

export default nextConfig
