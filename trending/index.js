#!/usr/bin/env node
// Main trending report runner
// Usage: npm run report

import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';

import { fetchBaidu }       from './scrapers/baidu.js';
import { fetchZhihu }       from './scrapers/zhihu.js';
import { fetchJuejin }      from './scrapers/juejin.js';
import { fetchHackerNews }  from './scrapers/hackernews.js';
import { fetchReddit }      from './scrapers/reddit.js';
import { fetchProductHunt } from './scrapers/producthunt.js';
import { generateReport }   from './reporter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(__dirname, 'reports');

async function main() {
  const start = Date.now();
  console.log('\n🔥 PodAha 热点收集系统\n');
  console.log(`⏰  ${dayjs().format('YYYY-MM-DD HH:mm')}\n`);

  // Fetch all platforms in parallel
  console.log('📡 抓取各平台热榜...');
  const [baidu, zhihu, juejin, hn, reddit, ph] = await Promise.all([
    fetchBaidu().then(r => { console.log(`  ✓ 百度热搜: ${r.length} 条`);  return r; }),
    fetchZhihu().then(r => { console.log(`  ✓ 知乎热榜: ${r.length} 条`);  return r; }),
    fetchJuejin().then(r => { console.log(`  ✓ 稀土掘金: ${r.length} 条`); return r; }),
    fetchHackerNews().then(r => { console.log(`  ✓ Hacker News: ${r.length} 条`); return r; }),
    fetchReddit().then(r => { console.log(`  ✓ Reddit: ${r.length} 条`);  return r; }),
    fetchProductHunt().then(r => { console.log(`  ✓ Product Hunt: ${r.length} 条`); return r; }),
  ]);

  const allItems = [...baidu, ...zhihu, ...juejin, ...hn, ...reddit, ...ph];
  console.log(`\n📊 合计: ${allItems.length} 条话题\n`);

  // Generate report
  console.log('✍️  生成选题报告...');
  const { md, dateStr } = generateReport(allItems);

  // Save to file
  mkdirSync(REPORTS_DIR, { recursive: true });
  const filename = join(REPORTS_DIR, `${dateStr}.md`);
  writeFileSync(filename, md, 'utf8');

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ 报告已保存: reports/${dateStr}.md`);
  console.log(`⚡ 耗时: ${elapsed}s\n`);
  console.log('💡 查看报告: open reports/' + dateStr + '.md');
  console.log('💡 深入研究: npm run research "<选题标题>"\n');
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
