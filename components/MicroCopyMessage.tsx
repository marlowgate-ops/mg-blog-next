import React from 'react';
import persuasionData from '@/content_source/messaging/persuasion.json';
import s from './MicroCopyMessage.module.css';

type MessageCategory = 'social_proof' | 'loss_aversion' | 'authority' | 'commitment' | 'clarity';

interface MicroCopyMessageProps {
  category: MessageCategory;
  className?: string;
  subtle?: boolean;
}

export default function MicroCopyMessage({ 
  category, 
  className = '', 
  subtle = false 
}: MicroCopyMessageProps) {
  const messages = persuasionData[category] || [];
  
  if (messages.length === 0) return null;
  
  // Rotate through messages based on current time to avoid repetition
  const messageIndex = Math.floor(Date.now() / (1000 * 60 * 30)) % messages.length; // Changes every 30 minutes
  const message = messages[messageIndex];
  
  return (
    <div 
      className={`${s.microCopyMessage} ${subtle ? s.subtle : ''} ${className}`}
      aria-live="polite"
      role="complementary"
    >
      <span className={s.messageText}>{message}</span>
    </div>
  );
}