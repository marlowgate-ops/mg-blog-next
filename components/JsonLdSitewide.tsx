'use client';

import { usePathname } from 'next/navigation';
import JsonLd from './JsonLd';
import { websiteSchema, organization } from '@/lib/seo/jsonld';

/**
 * Site-wide JSON-LD structured data
 * Includes Organization and WebSite schemas on all pages
 */
export default function JsonLdSitewide() {
  const pathname = usePathname();
  
  // Only include WebSite schema on homepage
  const isHomepage = pathname === '/';
  
  const orgSchema = organization({
    name: 'Marlow Gate',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com'}/og/logo_gate_monogram_dark.png`,
    sameAs: [
      'https://twitter.com/marlowgate',
      'https://github.com/marlowgate-ops'
    ]
  });
  
  return (
    <>
      <JsonLd data={orgSchema} />
      {isHomepage && <JsonLd data={websiteSchema()} />}
    </>
  );
}