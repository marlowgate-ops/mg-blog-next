import { AuthorProfile, OrganizationInfo } from '@/lib/authors/types';

interface JsonLdAuthorProps {
  author: AuthorProfile;
  organization: OrganizationInfo;
}

export default function JsonLdAuthor({ author, organization }: JsonLdAuthorProps) {
  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "jobTitle": author.title,
    "description": author.bio,
    "image": author.avatar,
    "url": `https://marlowgate.com/authors/${author.id}`,
    "sameAs": [
      author.social.twitter,
      author.social.linkedin,
      author.social.website
    ].filter(Boolean),
    "worksFor": {
      "@type": "Organization",
      "name": organization.name,
      "url": organization.website,
      "logo": organization.logo,
      "foundingDate": organization.established,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": organization.headquarters
      }
    },
    "hasCredential": author.credentials.map(credential => ({
      "@type": "EducationalOccupationalCredential",
      "name": credential
    })),
    "award": author.recognition.awards,
    "knowsAbout": author.expertise,
    "alumniOf": author.recognition.certifications,
    "hasOccupation": {
      "@type": "Occupation",
      "name": author.title,
      "occupationalCategory": "Financial Analyst",
      "skills": author.expertise
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
    />
  );
}