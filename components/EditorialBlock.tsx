import React from 'react';
import Image from 'next/image';
import { editorial } from '@/data/editorial';

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
      className={`editorial-block ${className}`}
      role="complementary"
      aria-labelledby="editorial-heading"
      id="editorial"
    >
      <div className="editorial-content">
        <div className="editorial-header">
          <Image
            src={editorial.icon}
            alt=""
            width={40}
            height={40}
            className="editorial-icon"
          />
          <h3 id="editorial-heading" className="editorial-title">
            {editorial.name}
          </h3>
        </div>
        <p className="editorial-description">
          {editorial.description}
        </p>
        {showPolicyLink && (
          <a href="/about#policy" className="editorial-link">
            編集方針を見る →
          </a>
        )}
      </div>
      
      <style jsx>{`
        .editorial-block {
          padding: 1rem 1.25rem;
          background: #f9fafb;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin: 1.5rem 0;
        }
        
        .editorial-content {
          max-width: none;
        }
        
        .editorial-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        .editorial-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .editorial-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
          line-height: 1.25;
        }
        
        .editorial-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0 0 0.5rem 0;
        }
        
        .editorial-link {
          color: #2563eb;
          font-size: 0.875rem;
          text-decoration: none;
          font-weight: 500;
        }
        
        .editorial-link:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 640px) {
          .editorial-block {
            padding: 0.875rem 1rem;
            margin: 1.25rem 0;
          }
          
          .editorial-icon {
            width: 32px;
            height: 32px;
          }
          
          .editorial-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}