/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ['*.e2b.app', 'localhost', '127.0.0.1'],
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      },
      {
        // Immutable local assets: cache hard at the CDN edge.
        source: '/sb-storage/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      }
    ];
  }
};
export default nextConfig;
