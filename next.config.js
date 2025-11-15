/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip static page generation for API routes
  // This prevents build-time errors when environment variables aren't available
  staticPageGenerationTimeout: 1000,
}

module.exports = nextConfig
