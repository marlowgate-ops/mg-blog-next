export interface AuthorProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  credentials: string[];
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  contact: {
    email?: string;
    phone?: string;
  };
  organization: {
    name: string;
    role: string;
    department?: string;
    startDate: string;
  };
  publications: {
    articlesCount: number;
    guidesCount: number;
    reviewsCount: number;
  };
  recognition: {
    awards?: string[];
    certifications?: string[];
    speaking?: string[];
  };
  metadata: {
    joinDate: string;
    lastActive: string;
    verified: boolean;
    featured: boolean;
  };
}

export interface AuthorContent {
  authorId: string;
  contentType: 'article' | 'guide' | 'review' | 'analysis';
  title: string;
  slug: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  views?: number;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface OrganizationInfo {
  name: string;
  description: string;
  website: string;
  logo: string;
  established: string;
  headquarters: string;
  employees: number;
  specializations: string[];
  social: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  certifications: string[];
  awards: string[];
}

export type AuthorSortField = 'name' | 'articlesCount' | 'joinDate' | 'lastActive';
export type AuthorFilterCategory = 'all' | 'fx' | 'insurance' | 'analysis' | 'education';

export const AUTHOR_EXPERTISE_AREAS = [
  'FX取引',
  '技術分析',
  'ファンダメンタル分析',
  'リスク管理',
  '自動車保険',
  '医療保険',
  '生命保険',
  '投資戦略',
  'マーケット分析',
  '金融規制',
  '暗号資産',
  '株式投資',
  '債券投資',
  '不動産投資',
  '年金・退職金',
  '税務・会計'
] as const;

export const DEFAULT_AUTHOR_AVATAR = '/avatars/default-author.svg';
export const ORGANIZATION_LOGO = '/brand/marlowgate-org.svg';