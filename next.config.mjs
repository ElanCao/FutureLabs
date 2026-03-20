/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';

const nextConfig = {
  // Static export for GitHub Pages
  ...(isStaticExport && {
    output: 'export',
    basePath: '/Future',
    images: { unoptimized: true },
  }),

  // Strict mode for better React error detection
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Prevent exposing framework info in response headers
  poweredByHeader: false,

  // Image optimization — add allowed external domains as needed
  ...(!isStaticExport && {
    images: {
      remotePatterns: [],
    },
  }),
};

export default nextConfig;
