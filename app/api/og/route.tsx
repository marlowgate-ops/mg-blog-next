import { ImageResponse } from '@vercel/og'

import { site } from '@/lib/site'

export const runtime = 'edge'

interface OGParams {
  title: string
  subtitle?: string
  type?: 'news' | 'broker' | 'default'
  source?: string
  time?: string
  score?: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const params: OGParams = {
      title: searchParams.get('title') || site.title,
      subtitle: searchParams.get('subtitle') || site.description,
      type: (searchParams.get('type') as OGParams['type']) || 'default',
      source: searchParams.get('source') || '',
      time: searchParams.get('time') || '',
      score: searchParams.get('score') || ''
    }

    // Truncate title to 2 lines max (approximately 50 characters per line)
    const titleLines = params.title.length > 50 
      ? [params.title.slice(0, 50), params.title.slice(50, 100)]
      : [params.title]

    // Determine subtitle based on type
    let displaySubtitle = params.subtitle
    if (params.type === 'news' && params.source) {
      displaySubtitle = `${params.source}${params.time ? ` • ${params.time}` : ''}`
    } else if (params.type === 'broker' && params.score) {
      displaySubtitle = `評価スコア: ${params.score}/5.0`
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '80px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#1f2937',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              M
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
              }}
            >
              {site.brand.name}
            </span>
          </div>

          {params.type !== 'default' && (
            <div
              style={{
                backgroundColor: params.type === 'news' ? '#ef4444' : '#3b82f6',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '24px',
              }}
            >
              {params.type === 'news' ? 'ニュース' : 'ブローカー'}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            {titleLines.map((line, index) => (
              <div
                key={index}
                style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  color: '#1f2937',
                  marginBottom: index < titleLines.length - 1 ? '8px' : '0',
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {displaySubtitle && (
            <div
              style={{
                fontSize: '24px',
                color: '#6b7280',
                fontWeight: '400',
                marginBottom: '40px',
              }}
            >
              {displaySubtitle}
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '8px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ef4444)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG Image generation error:', error)
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1f2937',
            color: '#ffffff',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          {site.brand.name}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}