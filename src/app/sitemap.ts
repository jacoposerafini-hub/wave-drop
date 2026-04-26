import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wavedrop.it';

const STATIC_PATHS: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }> = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/archive', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/shipping', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/returns', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/gift-card', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  try {
    const drops = await db.drop.findMany({
      select: { slug: true, updatedAt: true },
    });
    const products = await db.product.findMany({
      select: { slug: true, createdAt: true, drop: { select: { updatedAt: true } } },
    });

    const dropEntries: MetadataRoute.Sitemap = drops.map((d) => ({
      url: `${SITE_URL}/drop/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.drop?.updatedAt ?? p.createdAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...base, ...dropEntries, ...productEntries];
  } catch {
    return base;
  }
}
