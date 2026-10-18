import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://michaelbobov.com';
  return ['', '/work/versum', '/work/ez-recipe', '/work/pdf-penguin', '/work/spotify-loop'].map((p) => ({ url: base + p }));
}
