'use client';

import React, { useState, useCallback } from 'react';
import { NewsVoteStats } from '@/lib/news/types';
import { castVote, formatVoteCount, getVotePercentage, shouldShowVotes } from '@/lib/news/voting';
import s from './VoteWidget.module.css';

interface VoteWidgetProps {
  newsId: string;
  initialVotes?: NewsVoteStats;
  className?: string;
  compact?: boolean;
}

export default function VoteWidget({ 
  newsId, 
  initialVotes, 
  className = '',
  compact = false 
}: VoteWidgetProps) {
  const [votes, setVotes] = useState<NewsVoteStats>(initialVotes || {
    newsId,
    upvotes: 0,
    downvotes: 0,
    score: 0,
    totalVotes: 0,
    lastUpdated: Date.now()
  });
  
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = useCallback(async (voteType: 'up' | 'down') => {
    if (isVoting || userVote) return;
    
    setIsVoting(true);
    
    try {
      // In production, generate proper user identifier
      const userIdentifier = `user_${Date.now()}_${Math.random()}`;
      const updatedVotes = await castVote(newsId, voteType, userIdentifier);
      
      setVotes(updatedVotes);
      setUserVote(voteType);
      
      // Store user vote in localStorage to prevent re-voting
      localStorage.setItem(`vote_${newsId}`, voteType);
    } catch (error) {
      console.error('Failed to cast vote:', error);
    } finally {
      setIsVoting(false);
    }
  }, [newsId, isVoting, userVote]);

  // Check if user has already voted
  React.useEffect(() => {
    const existingVote = localStorage.getItem(`vote_${newsId}`);
    if (existingVote === 'up' || existingVote === 'down') {
      setUserVote(existingVote);
    }
  }, [newsId]);

  if (!shouldShowVotes(votes) && !userVote) {
    return (
      <div className={`${s.voteWidget} ${s.minimal} ${className}`}>
        <button
          onClick={() => handleVote('up')}
          disabled={isVoting}
          className={s.voteButton}
          aria-label="有用だった"
          title="有用だった"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => handleVote('down')}
          disabled={isVoting}
          className={s.voteButton}
          aria-label="有用でなかった"
          title="有用でなかった"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="m17 10-5 5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
  }

  const upvotePercentage = getVotePercentage(votes.upvotes, votes.totalVotes);
  
  if (compact) {
    return (
      <div className={`${s.voteWidget} ${s.compact} ${className}`}>
        <span className={s.score} title={`${votes.upvotes}件の高評価、${votes.downvotes}件の低評価`}>
          {votes.score > 0 ? '+' : ''}{votes.score}
        </span>
        <span className={s.percentage}>
          {upvotePercentage}%
        </span>
      </div>
    );
  }

  return (
    <div className={`${s.voteWidget} ${className}`}>
      <div className={s.voteButtons}>
        <button
          onClick={() => handleVote('up')}
          disabled={isVoting || !!userVote}
          className={`${s.voteButton} ${s.upvote} ${userVote === 'up' ? s.voted : ''}`}
          aria-label="有用だった"
          title="有用だった"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{formatVoteCount(votes.upvotes)}</span>
        </button>
        
        <button
          onClick={() => handleVote('down')}
          disabled={isVoting || !!userVote}
          className={`${s.voteButton} ${s.downvote} ${userVote === 'down' ? s.voted : ''}`}
          aria-label="有用でなかった"
          title="有用でなかった"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="m17 10-5 5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{formatVoteCount(votes.downvotes)}</span>
        </button>
      </div>
      
      <div className={s.voteStats}>
        <span className={s.score}>
          スコア: {votes.score > 0 ? '+' : ''}{votes.score}
        </span>
        <span className={s.percentage}>
          ({upvotePercentage}% positive)
        </span>
      </div>
      
      {userVote && (
        <div className={s.voteConfirmation}>
          {userVote === 'up' ? '評価ありがとうございます' : 'フィードバックありがとうございます'}
        </div>
      )}
    </div>
  );
}