/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // /about is now a page on this site (the littlest doll); the old /me link goes there too
      { source: '/me', destination: '/about', permanent: false },
      // The playground was folded into Side projects
      { source: '/playground', destination: '/side-projects', permanent: true },
      // EZ Recipe and PDF Penguin are side projects now, not case studies
      { source: '/work/ez-recipe', destination: '/side-projects#ez-recipe', permanent: true },
      { source: '/work/pdf-penguin', destination: '/side-projects#pdf-penguin', permanent: true },
    ];
  },
}

module.exports = nextConfig
