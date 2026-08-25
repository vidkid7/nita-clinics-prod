/** Railway env vars are sometimes host-only; rewrites need a valid absolute URL base. */
function normalizeApiBase() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').trim();
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/$/, '');
  const host = raw.replace(/^\/+/, '').replace(/\/$/, '');
  if (/^(localhost|127\.0\.0\.1)(\:|$)/i.test(host)) {
    return `http://${host}`;
  }
  return `https://${host}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Next Image optimization in production; dev can keep placeholders without optimizer friction.
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async headers() {
    return [
      {
        // HTML page responses — never cache aggressively so deploys show up immediately.
        // Listed first so it wins over any framework-injected defaults.
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Hashed static assets — safe to cache forever.
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${normalizeApiBase()}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
