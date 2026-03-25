/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';

const nextConfig = {
  // Exclude platform directory from build (separate app)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Static export for GitHub Pages
  ...(isStaticExport && {
    output: 'export',
    basePath: '/FutureLabs',
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
