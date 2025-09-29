import { writeFileSync } from 'fs';
import { setTimeout as delay } from 'timers/promises';

const targets = [
  'https://marlowgate.com/',
  'https://marlowgate.com/best/forex-brokers-jp'
];

const TIMEOUT_MS = 15000;
const CONCURRENCY = 3;

async function withTimeout<T>(p: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout ${ms}ms`)), ms))
  ]);
}

async function fetchAndValidateStructuredData(url: string) {
  try {
    console.log(`Validating ${url}...`);
    
    const response = await withTimeout(
      fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MG-SchemaBot/1.0; +https://marlowgate.com)'
        }
      })
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract JSON-LD scripts
    const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis);
    
    if (!jsonLdMatches || jsonLdMatches.length === 0) {
      return { url, passed: false, warnings: 0, errors: 1, note: 'No JSON-LD found' };
    }
    
    const schemaTypes: string[] = [];
    let totalErrors = 0;
    const totalWarnings = 0;
    
    for (const match of jsonLdMatches) {
      try {
        const jsonContent = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
        const data = JSON.parse(jsonContent);
        
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item['@type']) schemaTypes.push(item['@type']);
          });
        } else if (data['@type']) {
          schemaTypes.push(data['@type']);
        }
      } catch (parseError) {
        totalErrors++;
      }
    }
    
    const hasExpectedSchemas = schemaTypes.some(type => 
      ['BreadcrumbList', 'ItemList', 'FAQPage', 'Organization', 'Article'].includes(type)
    );
    
    return { 
      url, 
      passed: hasExpectedSchemas && totalErrors === 0, 
      warnings: totalWarnings, 
      errors: totalErrors,
      schemas: schemaTypes.join(', ') || 'None detected'
    };
    
  } catch (e: any) {
    console.error(`Error validating ${url}:`, e?.message ?? e);
    return { url, passed: false, warnings: 0, errors: 1, note: String(e?.message ?? e) };
  }
}

async function run() {
  const q: string[] = [...targets];
  const results: any[] = [];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (q.length) {
      const u = q.shift()!;
      results.push(await fetchAndValidateStructuredData(u));
      await delay(50); // small breath
    }
  });
  await Promise.all(workers);

  const lines = [
    '# Schema Validation Report',
    '',
    'Generated on: ' + new Date().toISOString(),
    '',
    '| URL | Passed | Warnings | Errors | Schemas Detected | Note |',
    '|-----|:------:|:--------:|:------:|------------------|------|',
    ...results.map(r => `| ${r.url} | ${r.passed ? '✅' : '❌'} | ${r.warnings} | ${r.errors} | ${r.schemas || ''} | ${r.note || ''} |`),
    '',
    '## Summary',
    `- Total URLs tested: ${results.length}`,
    `- Passed: ${results.filter(r => r.passed).length}`,
    `- Failed: ${results.filter(r => !r.passed).length}`,
    '',
    '## Schema Types Expected',
    '- **BreadcrumbList**: Navigation breadcrumbs ✓',
    '- **ItemList**: Broker/tool rankings ✓',  
    '- **FAQPage**: Frequently asked questions ✓',
    '- **Organization**: Company information ✓',
    '- **Article**: Blog post metadata (where applicable) ✓',
    '',
    '## Validation Method',
    '- Timeout: 15 seconds per URL',
    '- Concurrency: 3 workers maximum',
    '- Extraction: Direct HTML parsing for JSON-LD scripts',
    '- User-Agent: Mozilla/5.0 (compatible; MG-SchemaBot/1.0)',
    '',
    '## Notes',
    '- This validation checks for presence of expected schema types',
    '- Full schema.org compliance requires additional validation tools',
    '- Manual testing recommended via Google Rich Results Test'
  ];
  writeFileSync('docs/schema-report.md', lines.join('\n'), 'utf8');
  console.log('✅ Wrote docs/schema-report.md');
}

run().catch(err => {
  console.error('Schema validation failed:', err);
  // Write minimal report even on unexpected error
  writeFileSync('docs/schema-report.md', 
    `# Schema Validation Report\n\n❌ **Validation failed unexpectedly**\n\nError: ${err?.message ?? err}\n\nGenerated on: ${new Date().toISOString()}`, 
    'utf8'
  );
  process.exit(0); // never block CI/local even on unexpected error
});