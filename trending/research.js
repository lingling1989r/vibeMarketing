#!/usr/bin/env node
// Research tool: generates a material package for a selected topic
// Usage: npm run research "你的选题标题"
//
// Given a topic, this tool outputs:
//   - Targeted search queries for Baidu, Google, Zhihu, Reddit, HN
//   - Direct clickable search URLs
//   - Curated reference sites for podcast/creator topics
//   - Content angle suggestions for WeChat (story) and Twitter/X (tips)
//
// It does NOT auto-generate article drafts.
// Use it as a research starting point before writing manually.

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';
import { RESEARCH_SITES } from './config.js';
import { scoreRelevance, suggestAngles } from './analyzer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESEARCH_DIR = join(__dirname, 'research');

const topic = process.argv.slice(2).join(' ').trim();
if (!topic) {
  console.error('Usage: npm run research "<选题标题>"');
  process.exit(1);
}

function encodeQ(q) { return encodeURIComponent(q); }

function buildSearchLinks(topic) {
  // Generate multiple search query variants
  const zhQueries = [
    topic,
    `${topic} 播客`,
    `${topic} 内容创作`,
    `${topic} AI工具`,
    `${topic} 变现 2025`,
  ];
  const enQueries = [
    topic,
    `${topic} podcast`,
    `${topic} indie creator`,
    `${topic} content creation`,
    `${topic} SaaS`,
  ];

  const sections = [];

  // Chinese search links
  sections.push(`### 🇨🇳 中文搜索\n`);
  sections.push(`**百度**`);
  for (const q of zhQueries.slice(0, 3)) {
    sections.push(`- [${q}](https://www.baidu.com/s?wd=${encodeQ(q)})`);
  }
  sections.push(`\n**知乎**`);
  for (const q of zhQueries.slice(0, 3)) {
    sections.push(`- [知乎搜索「${q}」](https://www.zhihu.com/search?q=${encodeQ(q)}&type=content)`);
  }
  sections.push(`\n**稀土掘金**`);
  sections.push(`- [掘金搜索「${topic}」](https://juejin.cn/search?query=${encodeQ(topic)})`);
  sections.push(`- [掘金搜索「${topic} 播客」](https://juejin.cn/search?query=${encodeQ(topic + ' 播客')})`);
  sections.push(`\n**微信文章**`);
  sections.push(`- [微信搜一搜「${topic}」](https://weixin.sogou.com/weixin?type=2&query=${encodeQ(topic)})`);
  sections.push(`- [微信搜一搜「${topic} 播客」](https://weixin.sogou.com/weixin?type=2&query=${encodeQ(topic + ' 播客')})`);

  // English search links
  sections.push(`\n### 🌐 英文搜索\n`);
  sections.push(`**Google**`);
  for (const q of enQueries.slice(0, 3)) {
    sections.push(`- [${q}](https://www.google.com/search?q=${encodeQ(q)})`);
  }
  sections.push(`\n**Reddit**`);
  const redditSubs = ['podcasting', 'podcasters', 'indiehackers', 'SideProject'];
  for (const sub of redditSubs) {
    sections.push(`- [r/${sub}: search "${topic}"](https://www.reddit.com/r/${sub}/search/?q=${encodeQ(topic)}&sort=top&t=year)`);
  }
  sections.push(`\n**Hacker News**`);
  sections.push(`- [HN: "${topic}"](https://hn.algolia.com/?q=${encodeQ(topic)}&dateRange=pastYear&type=story)`);
  sections.push(`- [HN: "${topic} podcast"](https://hn.algolia.com/?q=${encodeQ(topic + ' podcast')}&type=story)`);
  sections.push(`\n**Twitter/X**`);
  sections.push(`- [X: "${topic} podcast"](https://x.com/search?q=${encodeQ(topic + ' podcast')}&src=typed_query&f=top)`);
  sections.push(`- [X: "${topic} indie creator"](https://x.com/search?q=${encodeQ(topic + ' indie creator')}&src=typed_query&f=top)`);

  return sections.join('\n');
}

function buildReferenceSection() {
  let s = `### 🎙️ 播客/创作者专项资源\n\n`;
  s += `**中文**\n`;
  for (const site of RESEARCH_SITES.zh) {
    s += `- [${site.name}](${site.url})\n`;
  }
  s += `\n**英文播客制作**\n`;
  for (const site of RESEARCH_SITES.en) {
    s += `- [${site.name}](${site.url})\n`;
  }
  return s;
}

function buildContentAngles(topic) {
  const { score, matches } = scoreRelevance(topic);
  const angles = suggestAngles(topic, matches);

  let s = '';

  s += `### 📱 公众号（故事类）\n\n`;
  s += `> 风格：有温度的故事 + 数据支撑 + 主人公成长弧线\n\n`;
  s += `**开头钩子选项**\n`;
  s += `1. 「那个每期节目只有50个听众的博主，现在年入20万——他做了什么？」\n`;
  s += `2. 「我录了3年播客，直到遇见${topic}，才知道我之前浪费了多少时间。」\n`;
  s += `3. 「结合热点：${topic}这件事，对播客主意味着什么？一个真实案例。」\n\n`;
  if (angles.zh.length > 0) {
    s += `**AI建议角度**\n`;
    angles.zh.forEach(a => s += `- ${a}\n`);
  }

  s += `\n### 🐦 Twitter/X（干货类，面向播客主 & 独立开发者）\n\n`;
  s += `> 风格：数据驱动 · 实用 tips · build in public 视角\n\n`;
  s += `**推文框架**\n`;
  s += `\`\`\`\n`;
  s += `${topic}:\n\n`;
  s += `→ [核心数据/结论]\n`;
  s += `→ [对播客主的影响]\n`;
  s += `→ [1个可操作的建议]\n\n`;
  s += `How I'm using this for my podcast:\n`;
  s += `[个人实操经验]\n\n`;
  s += `#podcasting #indiedev #BuildInPublic\n`;
  s += `\`\`\`\n`;
  if (angles.en.length > 0) {
    s += `\n**AI建议角度**\n`;
    angles.en.forEach(a => s += `- ${a}\n`);
  }

  s += `\n### 📝 知乎（问答型）\n\n`;
  s += `**搜索这些高流量问题并回答：**\n`;
  s += `- [如何从零开始做播客？](https://www.zhihu.com/search?q=如何从零开始做播客&type=content)\n`;
  s += `- [播客有哪些变现方式？](https://www.zhihu.com/search?q=播客变现&type=content)\n`;
  s += `- [AI工具如何提升播客制作效率？](https://www.zhihu.com/search?q=AI播客工具&type=content)\n`;
  s += `\n**结合「${topic}」的回答切入角度：**\n`;
  s += `> 先回答问题本身 → 引入「${topic}」趋势 → 分享PodAha如何帮助应对这个趋势\n`;

  return s;
}

async function main() {
  console.log(`\n📚 PodAha 选题研究工具\n`);
  console.log(`🎯 选题: "${topic}"\n`);

  const { score, matches, tier } = scoreRelevance(topic);
  const date = dayjs();
  const dateStr = date.format('YYYY-MM-DD');
  const safeTitle = topic.replace(/[^\w\u4e00-\u9fa5]/g, '-').slice(0, 40);

  let md = '';
  md += `# 📚 选题研究包：${topic}\n\n`;
  md += `> 生成时间: ${date.format('YYYY-MM-DD HH:mm')} | 关联度: ${score}/10\n\n`;
  if (matches.length > 0) {
    md += `> 命中关键词: \`${matches.join('`, `')}\`\n\n`;
  }
  md += `---\n\n`;

  md += `## 🔍 搜索素材\n\n`;
  md += buildSearchLinks(topic);
  md += `\n\n---\n\n`;

  md += `## 🎙️ 播客/创作者专项资源\n\n`;
  md += buildReferenceSection();
  md += `\n---\n\n`;

  md += `## ✍️ 内容角度建议\n\n`;
  md += buildContentAngles(topic);
  md += `\n\n---\n\n`;

  md += `## 📋 写作 Checklist\n\n`;
  md += `- [ ] 搜索以上链接，收集 5-10 条参考素材\n`;
  md += `- [ ] 确定目标用户画像（宝妈/IT人/副业创业者）\n`;
  md += `- [ ] 选择渠道（公众号故事类 / Twitter干货类 / 知乎问答）\n`;
  md += `- [ ] 起草文章（利用收集的素材）\n`;
  md += `- [ ] 运行分发工具: \`cd ../distributor && node index.js <article.md>\`\n\n`;
  md += `---\n`;
  md += `*PodAha 选题研究工具 | ${dateStr}*\n`;

  mkdirSync(RESEARCH_DIR, { recursive: true });
  const filename = join(RESEARCH_DIR, `${dateStr}-${safeTitle}.md`);
  writeFileSync(filename, md, 'utf8');

  console.log(`✅ 研究包已保存: research/${dateStr}-${safeTitle}.md`);
  console.log(`\n💡 用法：打开文件 → 点击搜索链接 → 收集素材 → 开始写作\n`);
  console.log(`📤 写完后运行分发工具:\n   cd ../distributor\n   node index.js articles/<your-article>.md\n`);
}

main().catch(console.error);
