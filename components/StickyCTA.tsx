"use client";
import React from "react";
import PrimaryCta from "./PrimaryCta";
import MicroCopyMessage from "./MicroCopyMessage";

interface StickyCTAProps {
  href?: string;
  deadline?: string;
  campaignText?: string;
  visible?: boolean;
}

export default function StickyCTA({
  href = "#table",
  deadline,
  campaignText = "公式サイトで口座開設",
  visible = true,
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const lastScrollY = React.useRef(0);

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolledPastHero = currentScrollY > 300;

      setIsVisible(visible && scrolledPastHero);
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  const daysRemaining = deadline ? getDaysRemaining(deadline) : 0;
  const showDeadline = deadline && daysRemaining > 0;

  if (!isVisible) return null;

  return (
    <div 
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
      }}
    >
      <div style={{ 
        maxWidth: "1100px", 
        margin: "0 auto", 
        padding: "var(--space-sm) var(--space-md)",
        display: "flex", 
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-sm)"
      }}>
        <div style={{ flex: 1, maxWidth: "240px" }}>
          <MicroCopyMessage category="commitment" subtle />
        </div>
        <div>
          <PrimaryCta href={href} label={campaignText} />
        </div>
        {showDeadline && (
          <div style={{ 
            fontSize: "var(--text-xs)", 
            color: "var(--text-muted)",
            minWidth: "80px",
            textAlign: "right"
          }}>
            残り{daysRemaining}日
          </div>
        )}
      </div>
    </div>
  );
}
