import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash — used for mock/demo hotel + IG images
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Instagram CDN (real Basic Display API responses)
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' },
      // Behold.so Instagram feed images
      { protocol: 'https', hostname: 'behold.pictures' },
      { protocol: 'https', hostname: '**.behold.pictures' },
      { protocol: 'https', hostname: 'scontent-*.cdninstagram.com' },
    ],
  },
}

export default nextConfig
