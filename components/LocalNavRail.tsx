"use client";
import React, { useEffect, useState } from "react";
import s from "@/app/best/layout.module.css";

const navItems = [
  { href: "#ranking", label: "総合" },
  { href: "#compare", label: "比較" },
  { href: "#eval", label: "評価" },
  { href: "#how-to-choose", label: "選び方" },
  { href: "#app-ux", label: "アプリ" },
  { href: "#cost-opt", label: "コスト" },
  { href: "#faq", label: "FAQ" },
];

export default function LocalNavRail() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0.1,
      }
    );

    // Observe all sections
    navItems.forEach(({ href }) => {
      const element = document.querySelector(href);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={s.localNav} aria-label="ページ内ナビゲーション">
      <ul className={s.localNavList}>
        {navItems.map((item) => (
          <li key={item.href} className={s.localNavItem}>
            <a
              href={item.href}
              className={`${s.localNavLink} ${
                activeSection === item.href.slice(1) ? s.active : ""
              }`}
              aria-label={item.label}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
