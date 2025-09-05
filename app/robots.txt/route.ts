import { SITE } from '@/lib/site'

export const revalidate = 60

export async function GET(){
  const body = `User-agent: *
Allow: /
Sitemap: ${SITE.url}/sitemap.xml
`
  return new Response(body, { headers: { 'Content-Type':'text/plain; charset=utf-8' } })
}
