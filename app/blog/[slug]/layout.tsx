export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  // Append a persistent CTA right after the article body.
  return (
    <article>
      {children}
      {/* ↓ fixed position: always exists */}
      <EndCTA />
    </article>
  );
}

// Use a relative import that does not rely on tsconfig paths.
import EndCTA from '../../components/EndCTA';
