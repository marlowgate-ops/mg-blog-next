import Link from 'next/link';
import FeaturedList from '@/components/FeaturedList'
import { allPosts } from 'contentlayer/generated';

export const revalidate = 60;

// undefined を許容して安全に日付表示するヘルパ
function safeDateLabel(value?: string): string {
  if (!value) return '';
  const t = Date.parse(value);
  if (isNaN(t)) return '';
  return new Date(t).toISOString().slice(0, 10); // YYYY-MM-DD
}

// 並び替え用：undefined や不正値でも 0 にフォールバック
function toTime(value?: string): number {
  const t = value ? Date.parse(value) : NaN;
  return isNaN(t) ? 0 : t;
}

export default function Home() {
  const posts = allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => toTime(b.date) - toTime(a.date));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Latest articles</h1>

      <div className="space-y-6">
        {posts.map((p) => (
          <article key={p._id} className="border-b pb-6">
            <h2 className="text-xl font-medium">
              <Link href={`/blog/${p.slug}`} className="underline">
                {p.title}
              </Link>
            </h2>

            {p.description && (
              <p className="mt-2 text-neutral-700">{p.description}</p>
            )}

            <div className="mt-2 text-xs text-neutral-500">
              {safeDateLabel(p.date)}
              {p.tags?.length ? (
                <>
                  {' '}
                  ·{' '}
                  {p.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/tags/${t}`}
                      className="underline mr-1"
                    >
                      {t}
                    </Link>
                  ))}
                </>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
