import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://michaelbobov.com';
  return ['', '/work', '/side-projects', '/about', '/work/versum', '/work/inkling', '/work/spotify-loop'].map((p) => ({ url: base + p }));
}
