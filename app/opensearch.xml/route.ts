import { site } from '@/lib/site'

export const GET = async () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${site.brand.name}</ShortName>
  <Description>FX・投資情報の検索 - ${site.brand.name}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <OutputEncoding>UTF-8</OutputEncoding>
  <Language>ja-JP</Language>
  <Url type="text/html" template="${site.url}/search?q={searchTerms}"/>
  <Url type="application/rss+xml" template="${site.url}/feed/posts.xml?q={searchTerms}"/>
  <Image height="16" width="16" type="image/x-icon">${site.url}/icon.png</Image>
  <Image height="64" width="64" type="image/png">${site.url}/icon.png</Image>
  <Developer>${site.author}</Developer>
  <Contact>contact@marlowgate.com</Contact>
  <SyndicationRight>open</SyndicationRight>
  <AdultContent>false</AdultContent>
  <Attribution>Copyright © ${new Date().getFullYear()} ${site.brand.name}. All rights reserved.</Attribution>
</OpenSearchDescription>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/opensearchdescription+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=86400', // 24 hours
    },
  })
}