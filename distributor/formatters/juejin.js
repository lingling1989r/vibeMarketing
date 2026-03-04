// 稀土掘金 formatter
// Juejin has good Markdown support, add tech-specific metadata

export function formatJuejin(markdown) {
  // Juejin supports frontmatter
  const frontmatter = `---
highlight: an-old-hope
theme: github
---\n\n`;

  // Add Juejin cover image reminder and tags
  const header = `> **掘金发布提示**：发布前请设置封面图和标签（建议选：AI · 工具 · 播客 · 效率）\n\n---\n\n`;

  let md = markdown;

  // Clean any HTML
  md = md.replace(/<[^>]+>/g, '');

  // Enhance code blocks with language hints if missing
  md = md.replace(/```\n/g, '```text\n');

  // Add tech callout for PodAha mention
  md = md.replace(
    /(PodAha|podaha\.com)/gi,
    '**[PodAha](https://podaha.com)**'
  );

  const footer = `\n\n---\n\n## 关于 PodAha\n\nPodAha 是一款 AI 播客生产平台，核心功能：\n\n- 🎙️ AI 降噪 & 去除语气词\n- 📝 自动转录 & 生成节目说明\n- ✂️ 一键提取精华社交片段\n- 🚀 一键发布 Spotify & Apple Podcasts\n\n**全流程从 5-8 小时压缩到 1 小时。**\n\n免费试用：https://podaha.com\n`;

  return `${frontmatter}${header}${md}${footer}`;
}
