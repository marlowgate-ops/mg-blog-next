import { AuthorProfile, OrganizationInfo } from './types';

export const organizationInfo: OrganizationInfo = {
  name: 'Marlow Gate',
  description: 'FX・投資・保険分野における専門的な情報提供と分析を行う金融メディア組織',
  website: 'https://marlowgate.com',
  logo: '/brand/marlowgate-org.svg',
  established: '2020',
  headquarters: '東京, 日本',
  employees: 25,
  specializations: [
    'FX・外国為替分析',
    '投資商品評価',
    '保険商品比較',
    'マーケット分析',
    '金融教育コンテンツ',
    'リスク管理コンサルティング'
  ],
  social: {
    twitter: 'https://twitter.com/marlowgate',
    linkedin: 'https://linkedin.com/company/marlowgate',
    facebook: 'https://facebook.com/marlowgate'
  },
  certifications: [
    'JFSA認定金融アドバイザー',
    'CFA Institute会員',
    'FP技能検定1級',
    '証券外務員一種'
  ],
  awards: [
    '2024年度 金融メディア優秀賞',
    '2023年度 投資教育貢献賞',
    '2022年度 FX分析精度賞'
  ]
};

export const authors: AuthorProfile[] = [
  {
    id: 'takeshi-yamamoto',
    name: '山本 毅',
    title: 'シニアFXアナリスト',
    bio: '15年以上のFX取引経験を持つシニアアナリスト。テクニカル分析とファンダメンタル分析を組み合わせた独自の手法で、多くのトレーダーから支持を得ている。',
    expertise: ['FX取引', '技術分析', 'ファンダメンタル分析', 'リスク管理'],
    credentials: [
      'CFA (Chartered Financial Analyst)',
      'FP技能検定1級',
      '証券外務員一種',
      'テクニカルアナリスト検定1級'
    ],
    avatar: '/avatars/takeshi-yamamoto.jpg',
    social: {
      twitter: 'https://twitter.com/takeshi_fx',
      linkedin: 'https://linkedin.com/in/takeshi-yamamoto',
      website: 'https://takeshi-fx-blog.com'
    },
    contact: {
      email: 'takeshi@marlowgate.com'
    },
    organization: {
      name: 'Marlow Gate',
      role: 'シニアFXアナリスト',
      department: 'マーケット分析部',
      startDate: '2020-04-01'
    },
    publications: {
      articlesCount: 248,
      guidesCount: 32,
      reviewsCount: 18
    },
    recognition: {
      awards: [
        '2024年度 FX分析優秀賞',
        '2023年度 投資教育貢献賞'
      ],
      certifications: [
        'CFA Institute会員',
        'JFSA認定金融アドバイザー'
      ],
      speaking: [
        'FX Tokyo Summit 2024 基調講演',
        'Investment Conference 2023 パネリスト',
        '金融セミナー定期講師'
      ]
    },
    metadata: {
      joinDate: '2020-04-01',
      lastActive: '2024-09-30',
      verified: true,
      featured: true
    }
  },
  {
    id: 'akiko-tanaka',
    name: '田中 明子',
    title: '保険アナリスト',
    bio: '保険業界12年の経験を持つ専門アナリスト。消費者目線での保険商品評価と、わかりやすい解説で定評がある。',
    expertise: ['自動車保険', '医療保険', '生命保険', 'リスク管理'],
    credentials: [
      'FP技能検定1級',
      '損害保険募集人資格',
      '生命保険募集人資格',
      'AFP認定者'
    ],
    avatar: '/avatars/akiko-tanaka.jpg',
    social: {
      twitter: 'https://twitter.com/akiko_insurance',
      linkedin: 'https://linkedin.com/in/akiko-tanaka'
    },
    contact: {
      email: 'akiko@marlowgate.com'
    },
    organization: {
      name: 'Marlow Gate',
      role: '保険アナリスト',
      department: '保険評価部',
      startDate: '2021-01-15'
    },
    publications: {
      articlesCount: 156,
      guidesCount: 28,
      reviewsCount: 45
    },
    recognition: {
      awards: [
        '2024年度 保険分析優秀賞'
      ],
      certifications: [
        'JFSA認定保険アドバイザー',
        'FP技能検定1級'
      ],
      speaking: [
        'Insurance Innovation Forum 2024',
        '消費者保護セミナー講師'
      ]
    },
    metadata: {
      joinDate: '2021-01-15',
      lastActive: '2024-09-28',
      verified: true,
      featured: true
    }
  },
  {
    id: 'hiroshi-suzuki',
    name: '鈴木 寛',
    title: 'マーケットストラテジスト',
    bio: '国際金融市場に精通したストラテジスト。グローバルな視点から日本市場への影響を分析し、実践的な投資戦略を提供。',
    expertise: ['投資戦略', 'マーケット分析', '金融規制', '株式投資'],
    credentials: [
      'CMA (Chartered Market Analyst)',
      '証券アナリスト',
      '国際証券アナリスト',
      'FP技能検定2級'
    ],
    avatar: '/avatars/hiroshi-suzuki.jpg',
    social: {
      twitter: 'https://twitter.com/hiroshi_market',
      linkedin: 'https://linkedin.com/in/hiroshi-suzuki',
      website: 'https://global-market-insight.com'
    },
    contact: {
      email: 'hiroshi@marlowgate.com'
    },
    organization: {
      name: 'Marlow Gate',
      role: 'マーケットストラテジスト',
      department: 'グローバル戦略部',
      startDate: '2020-08-01'
    },
    publications: {
      articlesCount: 189,
      guidesCount: 15,
      reviewsCount: 8
    },
    recognition: {
      awards: [
        '2023年度 マーケット分析精度賞'
      ],
      certifications: [
        'CMA (Chartered Market Analyst)',
        '国際証券アナリスト'
      ],
      speaking: [
        'Global Finance Summit 2024',
        'Asia Market Conference 2023'
      ]
    },
    metadata: {
      joinDate: '2020-08-01',
      lastActive: '2024-09-29',
      verified: true,
      featured: false
    }
  },
  {
    id: 'yuki-nakamura',
    name: '中村 由紀',
    title: 'FinTechアナリスト',
    bio: 'FinTech・暗号資産分野の専門家。新しい金融技術の動向と実用性を分析し、投資家向けに情報を提供。',
    expertise: ['暗号資産', 'FinTech', '投資戦略', '技術分析'],
    credentials: [
      '暗号資産技能検定上級',
      'FinTech検定1級',
      'FP技能検定2級',
      'ITストラテジスト'
    ],
    avatar: '/avatars/yuki-nakamura.jpg',
    social: {
      twitter: 'https://twitter.com/yuki_fintech',
      linkedin: 'https://linkedin.com/in/yuki-nakamura',
      github: 'https://github.com/yuki-nakamura'
    },
    contact: {
      email: 'yuki@marlowgate.com'
    },
    organization: {
      name: 'Marlow Gate',
      role: 'FinTechアナリスト',
      department: 'イノベーション戦略部',
      startDate: '2022-03-01'
    },
    publications: {
      articlesCount: 94,
      guidesCount: 12,
      reviewsCount: 6
    },
    recognition: {
      certifications: [
        '暗号資産技能検定上級',
        'FinTech検定1級'
      ],
      speaking: [
        'Blockchain Summit Tokyo 2024',
        'FinTech Innovation Forum 2023'
      ]
    },
    metadata: {
      joinDate: '2022-03-01',
      lastActive: '2024-09-25',
      verified: true,
      featured: false
    }
  }
];

// Helper functions
export function getAuthorById(id: string): AuthorProfile | undefined {
  return authors.find(author => author.id === id);
}

export function getAuthorsByExpertise(expertise: string): AuthorProfile[] {
  return authors.filter(author => 
    author.expertise.includes(expertise)
  );
}

export function getFeaturedAuthors(): AuthorProfile[] {
  return authors.filter(author => author.metadata.featured);
}

export function getAuthorContent(authorId: string, limit?: number) {
  // This would typically fetch from a database or CMS
  // For now, return mock data structure
  console.log(`Fetching content for author ${authorId}, limit: ${limit}`);
  return {
    articles: [],
    guides: [],
    reviews: [],
    total: 0
  };
}

export function getAuthorStats(authorId: string) {
  const author = getAuthorById(authorId);
  if (!author) return null;

  return {
    totalPublications: author.publications.articlesCount + 
                      author.publications.guidesCount + 
                      author.publications.reviewsCount,
    experienceYears: Math.floor(
      (new Date().getTime() - new Date(author.organization.startDate).getTime()) 
      / (1000 * 60 * 60 * 24 * 365)
    ),
    expertise: author.expertise,
    credentials: author.credentials.length,
    awards: author.recognition.awards?.length || 0
  };
}