import EndCTA from '@/app/components/EndCTA'

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Article-end CTA */}
      <EndCTA />
    </>
  )
}
