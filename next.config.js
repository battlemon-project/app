/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.battlemon.com/:path*",
      },
    ];
  },
}

module.exports = nextConfig
