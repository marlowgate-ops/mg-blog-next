"use client";
import React from "react";
import styles from "./MicroCopy.module.css";

interface MicroCopyProps {
  type?: "benefit" | "urgency" | "trust" | "social";
  children: React.ReactNode;
  className?: string;
}

export default function MicroCopy({ 
  type = "benefit", 
  children, 
  className = "" 
}: MicroCopyProps) {
  return (
    <div className={`${styles.microCopy} ${styles[type]} ${className}`}>
      {children}
    </div>
  );
}