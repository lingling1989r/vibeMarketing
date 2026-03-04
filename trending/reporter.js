// Daily report generator
// Outputs a Markdown report grouped by relevance tier

import dayjs from 'dayjs';
import { scoreRelevance, suggestAngles } from './analyzer.js';
import { RESEARCH_SITES } from './config.js';

const TIER_EMOJI = { high: '🔴', medium: '🟡', low: '⚪' };
const TIER_LABEL = { high: '高相关', medium: '中相关', low: '参考' };

/**
 * Enrich raw items with relevance scores and angles
 */
export function enrichItems(items) {
  return items
    .map((item) => {
      const { score, matches, tier } = scoreRelevance(item.title, item.summary);
      const angles = suggestAngles(item.title, matches);
      return { ...item, score, matches, tier, angles };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Generate full Markdown report
 */
export function generateReport(allItems, date = dayjs()) {
  const enriched = enrichItems(allItems);
  const dateStr = date.format('YYYY-MM-DD');
  const dateDisplay = date.format('YYYY年MM月DD日');

  const high   = enriched.filter((i) => i.tier === 'high');
  const medium = enriched.filter((i) => i.tier === 'medium');
  const low    = enriched.filter((i) => i.tier === 'low' && i.score >= 1);

  const platformCount = [...new Set(enriched.map((i) => i.platform))].length;

  let md = '';
  md += `# 🔥 PodAha 每日选题报告\n\n`;
  md += `> **${dateDisplay}** | 抓取平台 ${platformCount} 个 | 共 ${enriched.length} 条话题\n\n`;
  md += `> **用法**：看到感兴趣的选题，运行 \`npm run research "<选题标题>"\` 获取完整研究素材包\n\n`;
  md += `---\n\n`;

  // Summary stats
  md += `## 📊 今日概览\n\n`;
  md += `| 层级 | 数量 | 说明 |\n`;
  md += `|------|------|------|\n`;
  md += `| 🔴 高相关 | ${high.length} | 可直接结合 PodAha 功能写内容 |\n`;
  md += `| 🟡 中相关 | ${medium.length} | 需要角度包装，适合蹭热点 |\n`;
  md += `| ⚪ 参考 | ${low.length} | 背景信息，了解趋势用 |\n\n`;
  md += `---\n\n`;

  // High relevance section
  if (high.length > 0) {
    md += `## 🔴 高相关选题（直接可写）\n\n`;
    for (const item of high) {
      md += renderItem(item);
    }
  }

  // Medium relevance
  if (medium.length > 0) {
    md += `## 🟡 中相关选题（需要角度包装）\n\n`;
    for (const item of medium.slice(0, 15)) {
      md += renderItem(item);
    }
  }

  // Low / reference
  if (low.length > 0) {
    md += `## ⚪ 背景参考（了解趋势）\n\n`;
    md += low
      .slice(0, 10)
      .map((i) => `- [${i.title}](${i.url}) · ${i.platform}`)
      .join('\n');
    md += '\n\n';
  }

  // Persistent research links
  md += `---\n\n`;
  md += `## 📚 常用研究资源\n\n`;
  md += `### 中文播客/创作者资源\n`;
  for (const s of RESEARCH_SITES.zh) {
    md += `- [${s.name}](${s.url})\n`;
  }
  md += `\n### 英文播客/独立开发者资源\n`;
  for (const s of RESEARCH_SITES.en) {
    md += `- [${s.name}](${s.url})\n`;
  }
  md += `\n---\n`;
  md += `\n*生成时间: ${date.format('YYYY-MM-DD HH:mm')} | 运行 \`npm run report\` 更新*\n`;

  return { md, dateStr };
}

function renderItem(item) {
  let s = '';
  s += `### ${TIER_EMOJI[item.tier]} ${item.title}\n\n`;
  s += `| | |\n|---|---|\n`;
  s += `| **来源** | [${item.platform}](${item.url}) |\n`;
  if (item.hot > 0) {
    s += `| **热度** | ${item.hot.toLocaleString()} |\n`;
  }
  if (item.comments > 0) {
    s += `| **评论** | ${item.comments} |\n`;
  }
  s += `| **关联度** | ${item.score}/10 · 命中关键词: \`${item.matches.join('`, `')}\` |\n`;
  s += `| **语言** | ${item.lang === 'zh' ? '🇨🇳 中文' : '🌐 英文'} |\n`;
  if (item.summary) {
    s += `\n> ${item.summary.slice(0, 150)}${item.summary.length > 150 ? '…' : ''}\n`;
  }
  s += `\n**📝 内容角度建议：**\n`;
  if (item.angles.zh.length > 0) {
    s += `- 🇨🇳 公众号/知乎：${item.angles.zh[0]}\n`;
  }
  if (item.angles.en.length > 0) {
    s += `- 🌐 Twitter/X：${item.angles.en[0]}\n`;
  }
  s += `\n**🔗 深入研究：**\n`;
  s += `\`\`\`bash\nnpm run research "${item.title}"\n\`\`\`\n\n`;
  s += `---\n\n`;
  return s;
}
