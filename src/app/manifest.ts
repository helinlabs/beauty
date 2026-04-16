import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GlowList',
    short_name: 'GlowList',
    description: 'Same procedure, same clinic as your favorite influencer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0d14',
    theme_color: '#ff4f8b',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
