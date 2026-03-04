// 百家号 / 搜狐号 formatter
// These platforms support rich text but work best with clean, simple formatting

/**
 * Format for 百家号 (Baidu), 头条号, 搜狐号
 * Output: plain text with minimal markup hints
 * The user pastes this into the platform's editor and applies formatting manually
 */
export function formatBaijiahao(markdown, platform = '百家号') {
  const lines = markdown.split('\n');
  const out = [];
  let inCodeBlock = false;

  out.push(`===== ${platform} 发布版本 =====`);
  out.push(`发布提示：`);
  out.push(`1. 将下方内容复制到 ${platform} 编辑器`);
  out.push(`2. 【标题】行 → 设置为文章标题`);
  out.push(`3. 【H2/H3】行 → 设置为对应级别标题`);
  out.push(`4. 【图片】建议每500字插入1张相关图片`);
  out.push(`5. 文末记得插入 CTA：「免费试用 PodAha：podaha.com」`);
  out.push(`================================================\n`);

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) out.push('\n【代码示例开始】');
      else out.push('【代码示例结束】\n');
      continue;
    }

    if (inCodeBlock) {
      out.push(`  ${line}`);
      continue;
    }

    if (trimmed.startsWith('# ')) {
      out.push(`\n【标题】${trimmed.slice(2)}\n`);
    } else if (trimmed.startsWith('## ')) {
      out.push(`\n【H2】${trimmed.slice(3)}\n`);
    } else if (trimmed.startsWith('### ')) {
      out.push(`\n【H3】${trimmed.slice(4)}\n`);
    } else if (trimmed.startsWith('> ')) {
      out.push(`\n💬 ${trimmed.slice(2)}\n`);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      out.push(`• ${trimmed.slice(2)}`);
    } else if (/^\d+\. /.test(trimmed)) {
      out.push(trimmed);
    } else if (trimmed === '---') {
      out.push('\n────────────────────\n');
    } else if (trimmed === '') {
      out.push('');
    } else {
      // Strip markdown formatting for plain text
      const plain = trimmed
        .replace(/\*\*(.+?)\*\*/g, '「$1」')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '[$1]')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1 ( podaha.com )');
      out.push(plain);
    }
  }

  out.push('\n================================================');
  out.push('【文末 CTA - 必须保留】');
  out.push('想节省播客后期制作 80% 的时间？');
  out.push('免费试用 PodAha AI 播客工具：podaha.com');
  out.push('================================================\n');

  return out.join('\n');
}
