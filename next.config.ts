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
      // WordPress import — Eden For Your World legacy blog images
      { protocol: 'http',  hostname: 'www.edenforyourworld.com' },
      { protocol: 'https', hostname: 'www.edenforyourworld.com' },
      { protocol: 'http',  hostname: 'edenforyourworld.com' },
      { protocol: 'https', hostname: 'edenforyourworld.com' },
      // Virtuoso hotel database cover images
      { protocol: 'https', hostname: 'media.virtuoso.com' },
    ],
  },
}

export default nextConfig
