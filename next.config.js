/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['assets.coingecko.com'],
  },
  // Ensure proper handling of API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable experimental features if needed
  transpilePackages: [],
}

module.exports = nextConfig
