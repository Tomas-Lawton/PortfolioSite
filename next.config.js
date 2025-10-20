/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Make it fully static
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig