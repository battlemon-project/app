/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/battlemon-api/:path*",
        destination: "https://api.battlemon.com/:path*",
      },
    ];
  },
}

module.exports = nextConfig
