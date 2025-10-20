/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'miro.medium.com', 'i.ibb.co', 'lh4.googleusercontent.com', 'drive.usercontent.google.com'], 
  },
}

module.exports = nextConfig