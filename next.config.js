/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/me', destination: 'https://about.michaelbobov.com/', permanent: false },
      { source: '/about', destination: 'https://about.michaelbobov.com/', permanent: false },
    ];
  },
}

module.exports = nextConfig
