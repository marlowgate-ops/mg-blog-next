"use client";
import React from "react";
import Link from "next/link";
import s from "./BottomRecirculation.module.css";

interface RecirculationLink {
  href: string;
  label: string;
  description: string;
}

interface BottomRecirculationProps {
  /** Title for the recirculation section */
  title?: string;
  /** Array of links to display */
  links: RecirculationLink[];
  /** Show as compact list (default) or expanded cards */
  variant?: "compact" | "cards";
}

export default function BottomRecirculation({
  title = "このページの内容",
  links,
  variant = "compact",
}: BottomRecirculationProps) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className={s.recirculation} aria-labelledby="recirculation-title">
      <h2 id="recirculation-title" className={s.title}>
        {title}
      </h2>
      <nav className={s.nav}>
        <ul className={`${s.list} ${variant === "cards" ? s.cards : s.compact}`}>
          {links.map((link, index) => (
            <li key={index} className={s.item}>
              <Link href={link.href} className={s.link}>
                <span className={s.label}>{link.label}</span>
                {link.description && (
                  <span className={s.description}>{link.description}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}