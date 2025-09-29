import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface LighthouseResult {
  requestedUrl: string;
  configSettings?: {
    formFactor?: string;
  };
  userAgent?: string;
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

function detectFormFactor(lhrPath: string): 'desktop' | 'mobile' | 'unknown' {
  try {
    const data: LighthouseResult = JSON.parse(readFileSync(lhrPath, 'utf8'));
    
    // Primary: Check configSettings.formFactor
    if (data.configSettings?.formFactor) {
      return data.configSettings.formFactor === 'desktop' ? 'desktop' : 'mobile';
    }
    
    // Fallback: Check user agent
    if (data.userAgent) {
      if (data.userAgent.includes('Mobile') || data.userAgent.includes('Android')) {
        return 'mobile';
      }
      return 'desktop';
    }
    
    return 'unknown';
  } catch (error) {
    console.error(`Error detecting form factor for ${lhrPath}:`, error);
    return 'unknown';
  }
}

function findLighthouseFiles(dateDir: string): { desktop?: string; mobile?: string } {
  const result: { desktop?: string; mobile?: string } = {};
  
  // First, try standard naming
  const desktopPath = join(dateDir, 'desktop.lhr.json');
  const mobilePath = join(dateDir, 'mobile.lhr.json');
  
  if (existsSync(desktopPath)) result.desktop = desktopPath;
  if (existsSync(mobilePath)) result.mobile = mobilePath;
  
  // If we have both standard files, return early
  if (result.desktop && result.mobile) return result;
  
  // Auto-detect from lhr-*.json files
  try {
    const files = readdirSync(dateDir).filter(f => f.match(/^lhr-.*\.json$/));
    
    for (const file of files) {
      const filePath = join(dateDir, file);
      const formFactor = detectFormFactor(filePath);
      
      if (formFactor === 'desktop' && !result.desktop) {
        result.desktop = filePath;
      } else if (formFactor === 'mobile' && !result.mobile) {
        result.mobile = filePath;
      }
    }
  } catch (error) {
    console.warn(`Error auto-detecting lighthouse files in ${dateDir}:`, error);
  }
  
  return result;
}

function getStatus(desktopCLS: number, mobileCLS: number): string {
  if (desktopCLS < 0 || mobileCLS < 0) return '❌';
  return (desktopCLS < 0.05 && mobileCLS < 0.05) ? '✅' : '⚠️';
}

function updateCLSReport() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const artifactsDir = join(process.cwd(), 'docs', 'lighthouse', today);
  const reportPath = join(process.cwd(), 'docs', 'cls-report.md');
  
  if (!existsSync(artifactsDir)) {
    console.error(`Artifacts directory not found: ${artifactsDir}`);
    console.error(`Please create the directory and place lighthouse reports inside.`);
    process.exit(1);
  }
  
  // Find lighthouse files (preferring standard naming, falling back to auto-detection)
  const files = findLighthouseFiles(artifactsDir);
  
  if (!files.desktop || !files.mobile) {
    console.error(`Missing lighthouse files in ${artifactsDir}`);
    console.error(`Found: desktop=${files.desktop ? 'YES' : 'NO'}, mobile=${files.mobile ? 'YES' : 'NO'}`);
    console.error(`Expected: desktop.lhr.json, mobile.lhr.json (or auto-detectable lhr-*.json files)`);
    process.exit(1);
  }
  
  const desktopCLS = extractCLS(files.desktop);
  const mobileCLS = extractCLS(files.mobile);
  
  console.log(`Extracted CLS - Desktop: ${desktopCLS} (${files.desktop}), Mobile: ${mobileCLS} (${files.mobile})`);
  
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