import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthorById, getAuthorStats, organizationInfo } from '@/lib/authors/data';
import { DEFAULT_AUTHOR_AVATAR } from '@/lib/authors/types';
import JsonLdAuthor from '@/components/JsonLdAuthor';
import RelatedContent from '@/components/RelatedContent';
import s from './author.module.css';

interface AuthorPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const author = getAuthorById(params.id);
  
  if (!author) {
    return {
      title: 'Author Not Found'
    };
  }

  return {
    title: `${author.name} - ${author.title}`,
    description: author.bio,
    openGraph: {
      title: `${author.name} - ${author.title}`,
      description: author.bio,
      images: [
        {
          url: author.avatar || DEFAULT_AUTHOR_AVATAR,
          width: 400,
          height: 400,
          alt: `${author.name}のプロフィール写真`
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: `${author.name} - ${author.title}`,
      description: author.bio,
      images: [author.avatar || DEFAULT_AUTHOR_AVATAR]
    }
  };
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const author = getAuthorById(params.id);
  
  if (!author) {
    notFound();
  }

  const stats = getAuthorStats(params.id);

  return (
    <>
      <JsonLdAuthor author={author} organization={organizationInfo} />
      
      <div className={s.authorProfile}>
        {/* Author Hero Section */}
        <section className={s.heroSection}>
          <div className={s.heroContent}>
            <div className={s.authorHeader}>
              <div className={s.avatarWrapper}>
                <Image
                  src={author.avatar || DEFAULT_AUTHOR_AVATAR}
                  alt={`${author.name}のプロフィール写真`}
                  width={120}
                  height={120}
                  className={s.avatar}
                  priority
                />
                {author.metadata.verified && (
                  <div className={s.verifiedBadge} title="認証済みアカウント">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className={s.authorInfo}>
                <h1 className={s.authorName}>{author.name}</h1>
                <p className={s.authorTitle}>{author.title}</p>
                <p className={s.organization}>
                  <Link href="/about" className={s.orgLink}>
                    {author.organization.name}
                  </Link>
                  {author.organization.department && (
                    <span> • {author.organization.department}</span>
                  )}
                </p>
                
                {/* Social Links */}
                {(author.social.twitter || author.social.linkedin || author.social.website) && (
                  <div className={s.socialLinks}>
                    {author.social.twitter && (
                      <a
                        href={author.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.socialLink}
                        aria-label={`${author.name}のTwitter`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                        </svg>
                        Twitter
                      </a>
                    )}
                    {author.social.linkedin && (
                      <a
                        href={author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.socialLink}
                        aria-label={`${author.name}のLinkedIn`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                          <circle cx="4" cy="4" r="2"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {author.social.website && (
                      <a
                        href={author.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.socialLink}
                        aria-label={`${author.name}のウェブサイト`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                        </svg>
                        ウェブサイト
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Author Stats */}
            {stats && (
              <div className={s.statsGrid}>
                <div className={s.stat}>
                  <span className={s.statValue}>{stats.totalPublications}</span>
                  <span className={s.statLabel}>記事・ガイド</span>
                </div>
                <div className={s.stat}>
                  <span className={s.statValue}>{stats.experienceYears}</span>
                  <span className={s.statLabel}>年の経験</span>
                </div>
                <div className={s.stat}>
                  <span className={s.statValue}>{stats.credentials}</span>
                  <span className={s.statLabel}>専門資格</span>
                </div>
                <div className={s.stat}>
                  <span className={s.statValue}>{stats.awards}</span>
                  <span className={s.statLabel}>受賞・表彰</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className={s.aboutSection}>
          <div className={s.sectionContent}>
            <h2 className={s.sectionTitle}>プロフィール</h2>
            <div className={s.bioContent}>
              <p className={s.bio}>{author.bio}</p>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className={s.expertiseSection}>
          <div className={s.sectionContent}>
            <h2 className={s.sectionTitle}>専門分野</h2>
            <div className={s.expertiseGrid}>
              {author.expertise.map((skill) => (
                <div key={skill} className={s.expertiseItem}>
                  <span className={s.expertiseTag}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials Section */}
        <section className={s.credentialsSection}>
          <div className={s.sectionContent}>
            <h2 className={s.sectionTitle}>資格・認定</h2>
            <div className={s.credentialsGrid}>
              {author.credentials.map((credential) => (
                <div key={credential} className={s.credentialItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={s.credentialIcon}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>{credential}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition Section */}
        {(author.recognition.awards || author.recognition.speaking) && (
          <section className={s.recognitionSection}>
            <div className={s.sectionContent}>
              <h2 className={s.sectionTitle}>受賞・活動歴</h2>
              
              {author.recognition.awards && author.recognition.awards.length > 0 && (
                <div className={s.recognitionCategory}>
                  <h3 className={s.categoryTitle}>受賞歴</h3>
                  <ul className={s.recognitionList}>
                    {author.recognition.awards.map((award) => (
                      <li key={award} className={s.recognitionItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={s.awardIcon}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {author.recognition.speaking && author.recognition.speaking.length > 0 && (
                <div className={s.recognitionCategory}>
                  <h3 className={s.categoryTitle}>講演・登壇歴</h3>
                  <ul className={s.recognitionList}>
                    {author.recognition.speaking.map((event) => (
                      <li key={event} className={s.recognitionItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={s.speakingIcon}>
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recent Articles Section */}
        <section className={s.articlesSection}>
          <div className={s.sectionContent}>
            <div className={s.articlesHeader}>
              <h2 className={s.sectionTitle}>最近の記事</h2>
              <Link href={`/authors/${author.id}/articles`} className={s.viewAllLink}>
                すべて見る
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </Link>
            </div>
            
            {/* Placeholder for author's recent articles */}
            <div className={s.articlesPlaceholder}>
              <p>記事データの統合は今後のアップデートで実装予定です。</p>
              <p>現在、{author.name}氏は{author.publications.articlesCount}本の記事を執筆しています。</p>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <RelatedContent 
          title="関連する専門家"
          type="posts"
          items={[]}
          className={s.relatedSection}
        />
      </div>
    </>
  );
}