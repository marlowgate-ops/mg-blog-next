"use client";
import React from "react";
import PrimaryCta from "./PrimaryCta";

interface StickyCTAProps {
  href?: string;
  company?: string;
  deadline?: string;
  campaignText?: string;
  visible?: boolean;
}

export default function StickyCTA({
  href = "#table",
  company = "default",
  deadline,
  campaignText = "公式サイトで口座開設",
  visible = true,
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isScrollingDown, setIsScrollingDown] = React.useState(false);
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
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrolledPastHero = currentScrollY > 300;

      setIsScrollingDown(scrollingDown);
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
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <div style={{ background: "rgba(255,255,255,0.95)", padding: "12px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "center" }}>
          <PrimaryCta href={href} company={company} variant="compact" />
        </div>
      </div>
    </div>
  );
}
