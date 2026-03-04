// Relevance analyzer: scores each topic against PodAha's content strategy
import { KEYWORDS } from './config.js';

const WEIGHTS = {
  core:      5,
  ai_tools:  4,
  creator:   3,
  indie_dev: 3,
  tech_trend: 2,
  business:  1,
};

/**
 * Score a topic title+summary for relevance to PodAha's audience.
 * Returns { score: 0-10, matches: string[], tier: 'high'|'medium'|'low' }
 */
export function scoreRelevance(title, summary = '') {
  const text = `${title} ${summary}`.toLowerCase();
  let raw = 0;
  const matches = [];

  for (const [category, words] of Object.entries(KEYWORDS)) {
    const weight = WEIGHTS[category] ?? 1;
    for (const word of words) {
      if (text.includes(word.toLowerCase())) {
        raw += weight;
        matches.push(word);
        break; // Only count each category once per item
      }
    }
  }

  // Normalize to 0-10
  const maxPossible = Object.values(WEIGHTS).reduce((a, b) => a + b, 0); // 18
  const score = Math.min(10, Math.round((raw / maxPossible) * 10 * 1.8));

  let tier;
  if (score >= 6)      tier = 'high';
  else if (score >= 3) tier = 'medium';
  else                 tier = 'low';

  return { score, matches: [...new Set(matches)], tier };
}

/**
 * Suggest content angles based on topic + matched keywords
 */
export function suggestAngles(title, matches) {
  const angles = { zh: [], en: [] };

  if (matches.some(m => ['播客', 'podcast', 'podcasting'].includes(m))) {
    angles.zh.push(`"${title}"——播客主的机遇与实战指南`);
    angles.en.push(`How podcast creators can leverage: ${title}`);
  }
  if (matches.some(m => ['AI', '人工智能', 'AI工具', 'ai podcast'].includes(m.toLowerCase()))) {
    angles.zh.push(`用AI工具玩转"${title}"，播客效率提升指南`);
    angles.en.push(`AI-powered approach to: ${title} (for indie creators)`);
  }
  if (matches.some(m => ['副业', '变现', '知识付费', 'monetization', 'passive income'].includes(m.toLowerCase()))) {
    angles.zh.push(`围绕"${title}"，播客主如何找到第一个付费用户`);
    angles.en.push(`Monetizing ${title}: The solopreneur playbook`);
  }
  if (matches.some(m => ['独立开发', 'indie hacker', 'saas', 'side project'].includes(m.toLowerCase()))) {
    angles.zh.push(`独立开发者视角：如何把"${title}"做成产品`);
    angles.en.push(`Build in public: ${title} as a SaaS opportunity`);
  }

  // Fallback angles
  if (angles.zh.length === 0) {
    angles.zh.push(`"${title}"对播客内容创作者意味着什么？`);
  }
  if (angles.en.length === 0) {
    angles.en.push(`${title}: what it means for indie podcast creators`);
  }

  return angles;
}
