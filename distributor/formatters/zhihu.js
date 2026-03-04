// 知乎专栏 formatter
// Zhihu supports Markdown well, minimal changes needed

export function formatZhihu(markdown) {
  let md = markdown;

  // Add Zhihu-specific header notice
  const header = `> 本文首发于 PodAha 官方内容，欢迎关注获取更多 AI 播客工具干货。\n\n---\n\n`;

  // Zhihu doesn't render HTML, clean any HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Add source attribution at end
  const footer = `\n\n---\n\n**作者：PodAha 团队**\n\n> PodAha 是一款 AI 播客生产平台，帮助播客主把后期制作从 5-8 小时压缩到 1 小时以内。\n> 免费试用：[podaha.com](https://podaha.com)\n`;

  // Zhihu works well with standard Markdown headings
  // Just ensure H1 is used as the article title (not in body)
  const lines = md.split('\n');
  let title = '';
  const body = [];
  let foundTitle = false;

  for (const line of lines) {
    if (!foundTitle && line.startsWith('# ')) {
      title = line.slice(2).trim();
      foundTitle = true;
      // Don't include H1 in body (Zhihu uses it as article title separately)
    } else {
      body.push(line);
    }
  }

  const titleComment = title
    ? `<!--\n  知乎发布提示：\n  文章标题请填写：${title}\n  以下是正文内容\n-->\n\n`
    : '';

  return `${titleComment}${header}${body.join('\n')}${footer}`;
}
