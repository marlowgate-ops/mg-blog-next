import React from "react";
import s from "./CampaignNotice.module.css";

interface Campaign {
  title: string;
  description: string;
  deadline: string;
  href: string;
  provider: string;
}

// Sample campaign data - would ideally come from data/campaigns.ts
const campaigns: Campaign[] = [
  {
    title: "DMM.com証券 新規口座開設キャンペーン",
    description: "最大20,000円キャッシュバック",
    deadline: "2025-12-31",
    href: "https://fx.dmm.com/campaign/",
    provider: "DMM.com証券"
  },
  {
    title: "GMOクリック証券 特別キャンペーン",
    description: "新規口座開設で最大30,000円還元",
    deadline: "2025-11-30", 
    href: "https://www.click-sec.com/campaign/",
    provider: "GMOクリック証券"
  },
  {
    title: "FXTF 口座開設特典",
    description: "MT4取引で最大10,000円プレゼント",
    deadline: "2025-10-31",
    href: "https://www.fxtrade.co.jp/campaign/",
    provider: "FXTF"
  }
];

export default function CampaignNotice() {
  // Sort campaigns by deadline (earliest first)
  const sortedCampaigns = [...campaigns].sort((a, b) => 
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className={s.campaignSection} id="campaigns" aria-labelledby="campaign-title">
      <div className={s.container}>
        <h2 id="campaign-title" className={s.sectionTitle}>
          <span className={s.titleIcon}>🎁</span>
          開催中のキャンペーン
        </h2>
        
        <div className={s.campaignsGrid}>
          {sortedCampaigns.map((campaign, index) => (
            <div key={index} className={s.campaignCard}>
              <div className={s.cardHeader}>
                <h3 className={s.campaignTitle}>{campaign.title}</h3>
                <span className={s.provider}>{campaign.provider}</span>
              </div>
              
              <div className={s.cardBody}>
                <p className={s.description}>{campaign.description}</p>
                
                <div className={s.deadline}>
                  <span className={s.deadlineLabel}>締切:</span>
                  <span className={s.deadlineDate}>
                    {formatDeadline(campaign.deadline)}
                  </span>
                </div>
              </div>
              
              <div className={s.cardFooter}>
                <a
                  href={campaign.href}
                  target="_blank"
                  rel="nofollow sponsored"
                  className={s.campaignLink}
                >
                  詳細を見る
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className={s.notice}>
          <p className={s.noticeText}>
            <strong>※ キャンペーン内容は予告なく変更・終了する場合があります。</strong>
            詳細な条件や最新情報は各社公式サイトでご確認ください。
          </p>
        </div>
      </div>
    </section>
  );
}