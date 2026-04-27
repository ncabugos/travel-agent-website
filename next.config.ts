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
      // Virtuoso hotel database cover images (legacy — being phased out in
      // favour of mirrored Supabase Storage copies; see scripts/mirror_hotel_images.js)
      { protocol: 'https', hostname: 'media.virtuoso.com' },
      // Supabase Storage — mirrored hotel cover images (bucket: hotel-covers)
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
}

export default nextConfig
