/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  transpilePackages: ['framer-motion'],
  webpack: (config) => {
    return config
  }
}

module.exports = nextConfig
