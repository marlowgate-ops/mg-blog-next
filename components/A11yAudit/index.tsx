'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useAccessibility';
import styles from './A11yAudit.module.css';

interface A11yIssue {
  element: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  suggestion: string;
}

export function A11yAudit() {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Only show in development
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDev) return;

    const auditAccessibility = () => {
      const foundIssues: A11yIssue[] = [];

      // Check for missing alt text
      document.querySelectorAll('img:not([alt])').forEach((img, index) => {
        foundIssues.push({
          element: `img:nth-child(${index + 1})`,
          issue: 'Missing alt attribute',
          severity: 'error',
          suggestion: 'Add descriptive alt text for screen readers'
        });
      });

      // Check for empty alt text on decorative images
      document.querySelectorAll('img[alt=""]').forEach((img, index) => {
        const hasAriaHidden = img.hasAttribute('aria-hidden');
        if (!hasAriaHidden) {
          foundIssues.push({
            element: `img[alt=""]:nth-child(${index + 1})`,
            issue: 'Empty alt text without aria-hidden',
            severity: 'warning',
            suggestion: 'Add aria-hidden="true" for decorative images'
          });
        }
      });

      // Check for missing form labels
      document.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])').forEach((input, index) => {
        const id = input.getAttribute('id');
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        if (!hasLabel) {
          foundIssues.push({
            element: `input:nth-child(${index + 1})`,
            issue: 'Input missing label',
            severity: 'error',
            suggestion: 'Add a label element or aria-label attribute'
          });
        }
      });

      // Check for poor color contrast (basic check)
      document.querySelectorAll('a, button').forEach((element, index) => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Very basic contrast check - in real implementation, use a proper contrast ratio calculator
        if (color === backgroundColor) {
          foundIssues.push({
            element: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
            issue: 'Poor color contrast',
            severity: 'warning',
            suggestion: 'Ensure sufficient color contrast (4.5:1 for normal text)'
          });
        }
      });

      // Check for missing heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let lastLevel = 0;
      headings.forEach((heading, index) => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        if (currentLevel > lastLevel + 1) {
          foundIssues.push({
            element: `${heading.tagName.toLowerCase()}:nth-child(${index + 1})`,
            issue: 'Skipped heading level',
            severity: 'warning',
            suggestion: `Use h${lastLevel + 1} instead of ${heading.tagName.toLowerCase()}`
          });
        }
        lastLevel = currentLevel;
      });

      // Check for missing focus indicators
      document.querySelectorAll('a, button, input, select, textarea').forEach((element, index) => {
        const styles = window.getComputedStyle(element, ':focus');
        const outline = styles.outline;
        const boxShadow = styles.boxShadow;
        
        if (outline === 'none' && boxShadow === 'none') {
          foundIssues.push({
            element: `${element.tagName.toLowerCase()}:nth-child(${index + 1})`,
            issue: 'Missing focus indicator',
            severity: 'error',
            suggestion: 'Add visible focus styles with outline or box-shadow'
          });
        }
      });

      // Check for missing lang attribute
      if (!document.documentElement.hasAttribute('lang')) {
        foundIssues.push({
          element: 'html',
          issue: 'Missing lang attribute',
          severity: 'error',
          suggestion: 'Add lang attribute to html element (e.g., lang="ja")'
        });
      }

      // Check for missing page title
      if (!document.title.trim()) {
        foundIssues.push({
          element: 'title',
          issue: 'Missing or empty page title',
          severity: 'error',
          suggestion: 'Add descriptive page title'
        });
      }

      // Check for missing skip links
      const skipLinks = document.querySelector('a[href="#main"], a[href="#content"], button[onclick*="skip"]');
      if (!skipLinks) {
        foundIssues.push({
          element: 'body',
          issue: 'Missing skip links',
          severity: 'warning',
          suggestion: 'Add skip links for keyboard navigation'
        });
      }

      setIssues(foundIssues);
    };

    // Run audit after a short delay to allow page to render
    const timer = setTimeout(auditAccessibility, 1000);

    // Re-run audit when DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      setTimeout(auditAccessibility, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['alt', 'aria-label', 'aria-labelledby', 'lang']
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isDev]);

  if (!isDev) return null;

  const errorCount = issues.filter(issue => issue.severity === 'error').length;
  const warningCount = issues.filter(issue => issue.severity === 'warning').length;

  return (
    <div className={styles.audit}>
      <button
        className={styles.toggle}
        onClick={() => setIsVisible(!isVisible)}
        aria-expanded={isVisible}
      >
        A11y ({errorCount} errors, {warningCount} warnings)
      </button>

      {isVisible && (
        <div 
          className={styles.panel}
          style={{
            animationDuration: prefersReducedMotion ? '0ms' : '200ms'
          }}
        >
          <div className={styles.header}>
            <h3>Accessibility Audit</h3>
            <button
              className={styles.close}
              onClick={() => setIsVisible(false)}
              aria-label="Close accessibility audit"
            >
              ×
            </button>
          </div>

          <div className={styles.summary}>
            <span className={styles.errorBadge}>{errorCount} Errors</span>
            <span className={styles.warningBadge}>{warningCount} Warnings</span>
          </div>

          <div className={styles.issuesList}>
            {issues.length === 0 ? (
              <div className={styles.noIssues}>
                🎉 No accessibility issues found!
              </div>
            ) : (
              issues.map((issue, index) => (
                <div
                  key={index}
                  className={`${styles.issue} ${styles[issue.severity]}`}
                >
                  <div className={styles.issueHeader}>
                    <span className={styles.element}>{issue.element}</span>
                    <span className={styles.severity}>{issue.severity}</span>
                  </div>
                  <div className={styles.issueDescription}>
                    <strong>{issue.issue}</strong>
                    <p>{issue.suggestion}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}