import SearchBox from '@/components/SearchBox'

export const dynamic = 'force-static'

export default function SearchPage() {
  return (
    <section>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">検索</h1>
        <p className="text-neutral-600 mt-1">記事タイトル・要約・タグを横断検索します（ローカルで完結・高速）。</p>
      </header>
      <SearchBox />
    </section>
  )
}
