import Image from 'next/image';
import Link from 'next/link';
import { AuthorProfile } from '@/lib/authors/types';
import { DEFAULT_AUTHOR_AVATAR } from '@/lib/authors/types';
import s from './AuthorCard.module.css';

interface AuthorCardProps {
  author: AuthorProfile;
  variant?: 'compact' | 'detailed' | 'minimal';
  showStats?: boolean;
  showBio?: boolean;
  showSocial?: boolean;
  className?: string;
}

export default function AuthorCard({
  author,
  variant = 'compact',
  showStats = true,
  showBio = true,
  showSocial = false,
  className = ''
}: AuthorCardProps) {
  const totalPublications = author.publications.articlesCount + 
                           author.publications.guidesCount + 
                           author.publications.reviewsCount;

  const experienceYears = Math.floor(
    (new Date().getTime() - new Date(author.organization.startDate).getTime()) 
    / (1000 * 60 * 60 * 24 * 365)
  );

  return (
    <article className={`${s.authorCard} ${s[variant]} ${className}`}>
      {/* Author Header */}
      <div className={s.authorHeader}>
        <div className={s.avatarWrapper}>
          <Image
            src={author.avatar || DEFAULT_AUTHOR_AVATAR}
            alt={`${author.name}のプロフィール写真`}
            width={variant === 'detailed' ? 80 : variant === 'compact' ? 64 : 48}
            height={variant === 'detailed' ? 80 : variant === 'compact' ? 64 : 48}
            className={s.avatar}
            priority={author.metadata.featured}
          />
          {author.metadata.verified && (
            <div className={s.verifiedBadge} title="認証済みアカウント">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          )}
        </div>
        
        <div className={s.authorInfo}>
          <h3 className={s.authorName}>
            <Link href={`/authors/${author.id}`} className={s.authorLink}>
              {author.name}
            </Link>
          </h3>
          <p className={s.authorTitle}>{author.title}</p>
          {variant !== 'minimal' && (
            <p className={s.organization}>
              {author.organization.name} • {author.organization.department}
            </p>
          )}
        </div>
      </div>

      {/* Author Bio */}
      {showBio && variant !== 'minimal' && (
        <div className={s.authorBio}>
          <p>{author.bio}</p>
        </div>
      )}

      {/* Expertise Tags */}
      {variant === 'detailed' && (
        <div className={s.expertiseSection}>
          <h4 className={s.sectionTitle}>専門分野</h4>
          <div className={s.expertiseTags}>
            {author.expertise.slice(0, 4).map((skill) => (
              <span key={skill} className={s.expertiseTag}>
                {skill}
              </span>
            ))}
            {author.expertise.length > 4 && (
              <span className={s.expertiseMore}>
                +{author.expertise.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Author Stats */}
      {showStats && variant !== 'minimal' && (
        <div className={s.authorStats}>
          <div className={s.stat}>
            <span className={s.statValue}>{totalPublications}</span>
            <span className={s.statLabel}>記事</span>
          </div>
          <div className={s.stat}>
            <span className={s.statValue}>{experienceYears}</span>
            <span className={s.statLabel}>年経験</span>
          </div>
          <div className={s.stat}>
            <span className={s.statValue}>{author.credentials.length}</span>
            <span className={s.statLabel}>資格</span>
          </div>
          {author.recognition.awards && (
            <div className={s.stat}>
              <span className={s.statValue}>{author.recognition.awards.length}</span>
              <span className={s.statLabel}>受賞</span>
            </div>
          )}
        </div>
      )}

      {/* Credentials */}
      {variant === 'detailed' && (
        <div className={s.credentialsSection}>
          <h4 className={s.sectionTitle}>資格・認定</h4>
          <ul className={s.credentialsList}>
            {author.credentials.slice(0, 3).map((credential) => (
              <li key={credential} className={s.credential}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={s.credentialIcon}>
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                {credential}
              </li>
            ))}
            {author.credentials.length > 3 && (
              <li className={s.credentialMore}>
                他 {author.credentials.length - 3} 件
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Social Links */}
      {showSocial && (author.social.twitter || author.social.linkedin || author.social.website) && (
        <div className={s.socialSection}>
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
              </a>
            )}
          </div>
        </div>
      )}

      {/* View Profile Link */}
      {variant !== 'detailed' && (
        <div className={s.profileLink}>
          <Link href={`/authors/${author.id}`} className={s.viewProfile}>
            プロフィールを見る
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </Link>
        </div>
      )}
    </article>
  );
}