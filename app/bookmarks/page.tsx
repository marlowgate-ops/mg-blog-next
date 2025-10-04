import { Metadata } from 'next';
import BookmarksClient from './BookmarksClient';

export const metadata: Metadata = {
  title: 'ブックマーク | マーロウゲート',
  description: '保存した記事やページを確認できます。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookmarksPage() {
  return <BookmarksClient />;
}