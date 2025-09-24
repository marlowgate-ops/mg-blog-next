import React from 'react';
import s from '../app/best/layout.module.css';

type LfSection = { 
  id: string; 
  title: string; 
  prose: React.ReactNode 
};

export default function LongForm({ sections }: { sections: LfSection[] }) {
  return (
    <div className={s.longform}>
      {/* Mini-TOC at the top */}
      <nav aria-label="セクション目次">
        <h3>このセクションの内容</h3>
        <ol className={s.longformToc}>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} aria-label={section.title}>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Render sections */}
      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h3>{section.title}</h3>
          <div className={s.longformContent}>
            {section.prose}
          </div>
        </section>
      ))}
    </div>
  );
}