import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface LighthouseResult {
  requestedUrl: string;
  audits: {
    'cumulative-layout-shift'?: {
      numericValue: number;
    };
    metrics?: {
      details: {
        items: Array<{
          cumulativeLayoutShift?: number;
        }>;
      };
    };
  };
}

function extractCLS(lhrPath: string): number {
  try {
    const data: LighthouseResult = JSON.parse(readFileSync(lhrPath, 'utf8'));
    
    // Primary: Try cumulative-layout-shift audit
    if (data.audits['cumulative-layout-shift']?.numericValue !== undefined) {
      return data.audits['cumulative-layout-shift'].numericValue;
    }
    
    // Fallback: Try metrics.details.items[0].cumulativeLayoutShift
    if (data.audits.metrics?.details?.items?.[0]?.cumulativeLayoutShift !== undefined) {
      return data.audits.metrics.details.items[0].cumulativeLayoutShift;
    }
    
    console.warn(`No CLS data found in ${lhrPath}`);
    return -1;
  } catch (error) {
    console.error(`Error reading ${lhrPath}:`, error);
    return -1;
  }
}

function getStatus(desktopCLS: number, mobileCLS: number): string {
  if (desktopCLS < 0 || mobileCLS < 0) return '❌';
  return (desktopCLS < 0.05 && mobileCLS < 0.05) ? '✅' : '⚠️';
}

function updateCLSReport() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const artifactsDir = join(process.cwd(), 'docs', 'lighthouse', today);
  const reportPath = join(process.cwd(), 'docs', 'cls-report.md');
  
  // Extract CLS values
  const desktopPath = join(artifactsDir, 'desktop.lhr.json');
  const mobilePath = join(artifactsDir, 'mobile.lhr.json');
  
  if (!existsSync(desktopPath) || !existsSync(mobilePath)) {
    console.error(`Missing lighthouse files in ${artifactsDir}`);
    console.error(`Expected: desktop.lhr.json, mobile.lhr.json`);
    process.exit(1);
  }
  
  const desktopCLS = extractCLS(desktopPath);
  const mobileCLS = extractCLS(mobilePath);
  
  console.log(`Extracted CLS - Desktop: ${desktopCLS}, Mobile: ${mobileCLS}`);
  
  // URLs to test (assuming both desktop and mobile tested same URLs)
  const urls = ['/', '/best/forex-brokers-jp'];
  
  // Create or read existing report
  let reportContent = '';
  if (existsSync(reportPath)) {
    reportContent = readFileSync(reportPath, 'utf8');
  } else {
    reportContent = `# CLS Report

| Date | URL | Desktop CLS | Mobile CLS | Status |
|------|-----|-------------|------------|--------|
`;
  }
  
  // Remove existing entries for today (if any) and add new ones
  const lines = reportContent.split('\n');
  const headerIndex = lines.findIndex(line => line.includes('| Date | URL |'));
  const separatorIndex = headerIndex + 1;
  
  if (headerIndex === -1) {
    // Create new table
    reportContent = `# CLS Report

| Date | URL | Desktop CLS | Mobile CLS | Status |
|------|-----|-------------|------------|--------|
`;
    lines.length = 0;
    lines.push(...reportContent.split('\n'));
  }
  
  // Filter out today's entries
  const filteredLines = lines.filter((line, index) => {
    if (index <= separatorIndex) return true; // Keep header and separator
    return !line.includes(`| ${today} |`);
  });
  
  // Add new entries
  for (const url of urls) {
    const status = getStatus(desktopCLS, mobileCLS);
    const newLine = `| ${today} | ${url} | ${desktopCLS.toFixed(3)} | ${mobileCLS.toFixed(3)} | ${status} |`;
    filteredLines.push(newLine);
  }
  
  const updatedReport = filteredLines.join('\n');
  writeFileSync(reportPath, updatedReport, 'utf8');
  
  console.log(`✅ Updated ${reportPath}`);
  console.log(`📊 CLS Summary:`);
  console.log(`   Desktop: ${desktopCLS.toFixed(3)} ${desktopCLS < 0.05 ? '✅' : '⚠️'}`);
  console.log(`   Mobile:  ${mobileCLS.toFixed(3)} ${mobileCLS < 0.05 ? '✅' : '⚠️'}`);
  console.log(`   Overall: ${getStatus(desktopCLS, mobileCLS)}`);
  
  if (desktopCLS >= 0.05 || mobileCLS >= 0.05) {
    console.log('\n⚠️  CLS values >= 0.05 detected. Consider optimizations:');
    console.log('   - Add width/height to images');
    console.log('   - Use aspectRatio CSS for responsive images');  
    console.log('   - Reserve space for async content');
    console.log('   - Optimize web fonts with font-display: swap');
  }
}

updateCLSReport();