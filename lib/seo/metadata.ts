// SEO Helper Functions
import { Metadata } from 'next';

interface SEOConfig {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

const SITE_CONFIG = {
  name: "MG Blog",
  description: "FX・CFD業者の比較評価サイト",
  url: "https://mg-blog-next.vercel.app",
  image: "/og-default.png", // fallback image
};

export function generateSEOMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false
}: SEOConfig): Metadata {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const fullDescription = description || SITE_CONFIG.description;
  const canonicalUrl = `${SITE_CONFIG.url}${path}`;
  const ogImage = image ? `${SITE_CONFIG.url}${image}` : `${SITE_CONFIG.url}${SITE_CONFIG.image}`;

  return {
    title: fullTitle,
    description: fullDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        }
      ],
      type: 'website',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
      creator: '@mg_blog',
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
    }
  };
}

export function generateCanonicalURL(path: string): string {
  return `${SITE_CONFIG.url}${path}`;
}

export function getDefaultOGImage(): string {
  return `${SITE_CONFIG.url}${SITE_CONFIG.image}`;
}