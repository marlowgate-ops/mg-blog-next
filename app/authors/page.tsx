import { Metadata } from 'next';
import { authors, getFeaturedAuthors, organizationInfo } from '@/lib/authors/data';
import AuthorCard from '@/components/AuthorCard';
import s from './authors.module.css';

export const metadata: Metadata = {
  title: '執筆者・専門家',
  description: 'Marlow Gateの執筆者・専門家一覧。FX、投資、保険分野の専門知識を持つアナリストとストラテジストが質の高い情報を提供します。',
  openGraph: {
    title: '執筆者・専門家 - Marlow Gate',
    description: 'FX、投資、保険分野の専門知識を持つアナリストとストラテジストが質の高い情報を提供します。',
  }
};

export default function AuthorsPage() {
  const featuredAuthors = getFeaturedAuthors();
  const allAuthors = authors;

  return (
    <div className={s.authorsPage}>
      {/* Page Header */}
      <section className={s.pageHeader}>
        <div className={s.headerContent}>
          <h1 className={s.pageTitle}>執筆者・専門家</h1>
          <p className={s.pageDescription}>
            FX、投資、保険分野の専門知識を持つアナリストとストラテジストが、
            実践的で信頼性の高い情報をお届けします。
          </p>
        </div>
      </section>

      {/* Organization Info */}
      <section className={s.organizationSection}>
        <div className={s.orgContent}>
          <div className={s.orgHeader}>
            <div className={s.orgLogo}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
              </svg>
            </div>
            <div className={s.orgInfo}>
              <h2 className={s.orgName}>{organizationInfo.name}</h2>
              <p className={s.orgDescription}>{organizationInfo.description}</p>
            </div>
          </div>
          
          <div className={s.orgStats}>
            <div className={s.orgStat}>
              <span className={s.orgStatValue}>{organizationInfo.employees}</span>
              <span className={s.orgStatLabel}>専門家</span>
            </div>
            <div className={s.orgStat}>
              <span className={s.orgStatValue}>{organizationInfo.established}</span>
              <span className={s.orgStatLabel}>設立年</span>
            </div>
            <div className={s.orgStat}>
              <span className={s.orgStatValue}>{organizationInfo.certifications.length}</span>
              <span className={s.orgStatLabel}>認定資格</span>
            </div>
            <div className={s.orgStat}>
              <span className={s.orgStatValue}>{organizationInfo.awards.length}</span>
              <span className={s.orgStatLabel}>受賞歴</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Authors */}
      {featuredAuthors.length > 0 && (
        <section className={s.featuredSection}>
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle}>注目の専門家</h2>
            <p className={s.sectionDescription}>
              豊富な経験と実績を持つ、当サイトの主要執筆者をご紹介します。
            </p>
          </div>
          
          <div className={s.featuredGrid}>
            {featuredAuthors.map((author) => (
              <AuthorCard
                key={author.id}
                author={author}
                variant="detailed"
                showStats={true}
                showBio={true}
                showSocial={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Authors */}
      <section className={s.allAuthorsSection}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>全ての執筆者</h2>
          <p className={s.sectionDescription}>
            それぞれの専門分野で活躍する執筆者・アナリストの一覧です。
          </p>
        </div>
        
        <div className={s.authorsGrid}>
          {allAuthors.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              variant="compact"
              showStats={true}
              showBio={true}
              showSocial={false}
            />
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section className={s.specializationsSection}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>専門分野</h2>
          <p className={s.sectionDescription}>
            当組織が扱う主要な専門領域とサービス分野です。
          </p>
        </div>
        
        <div className={s.specializationsGrid}>
          {organizationInfo.specializations.map((specialization) => (
            <div key={specialization} className={s.specializationItem}>
              <div className={s.specializationIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <span className={s.specializationText}>{specialization}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section className={s.contactSection}>
        <div className={s.contactContent}>
          <h2 className={s.contactTitle}>お問い合わせ</h2>
          <p className={s.contactDescription}>
            専門的なご質問や取材のご依頼は、各執筆者のプロフィールページまたは
            組織の公式サイトからお気軽にお問い合わせください。
          </p>
          
          <div className={s.contactLinks}>
            <a
              href={organizationInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className={s.contactLink}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
              </svg>
              公式サイト
            </a>
            
            {organizationInfo.social.linkedin && (
              <a
                href={organizationInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={s.contactLink}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
            )}
            
            {organizationInfo.social.twitter && (
              <a
                href={organizationInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={s.contactLink}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
                Twitter
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}