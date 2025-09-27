import React from 'react';
import Image from 'next/image';
import { editorial } from '@/data/editorial';
import s from './EditorialBlock.module.css';

interface EditorialBlockProps {
  className?: string;
  showPolicyLink?: boolean;
}

export default function EditorialBlock({ 
  className = '', 
  showPolicyLink = false 
}: EditorialBlockProps) {
  return (
    <div 
      className={`${s.editorialBlock} ${className}`}
      role="complementary"
      aria-labelledby="editorial-heading"
      id="editorial"
    >
      <div className={s.editorialContent}>
        <div className={s.editorialHeader}>
          <Image
            src={editorial.icon}
            alt=""
            width={40}
            height={40}
            className={s.editorialIcon}
          />
          <h3 id="editorial-heading" className={s.editorialTitle}>
            {editorial.name}
          </h3>
        </div>
        <p className={s.editorialDescription}>
          {editorial.description}
        </p>
        {showPolicyLink && (
          <a href="/about#policy" className={s.editorialLink}>
            編集方針を見る →
          </a>
        )}
      </div>
    </div>
  );
}