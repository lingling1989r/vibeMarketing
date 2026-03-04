// WeChat formatter: converts Markdown to WeChat-editor-compatible HTML
// WeChat doesn't support standard Markdown, needs inline styles

/**
 * Parse Markdown and output styled HTML suitable for
 * copy-pasting into the WeChat Official Account editor.
 * Uses inline styles (WeChat strips <style> tags).
 */
export function formatWechat(markdown) {
  const BRAND_COLOR = '#7c3aed';   // PodAha purple
  const ACCENT_COLOR = '#a78bfa';
  const TEXT_COLOR = '#2d2d2d';
  const LIGHT_BG = '#f5f3ff';

  let html = markdown
    // H1 → WeChat title style
    .replace(/^# (.+)$/gm, `<h1 style="font-size:22px;font-weight:bold;color:${BRAND_COLOR};text-align:center;margin:24px 0 8px;line-height:1.4">$1</h1>`)
    // H2 → Section heading with left border
    .replace(/^## (.+)$/gm, `<h2 style="font-size:18px;font-weight:bold;color:${BRAND_COLOR};border-left:4px solid ${BRAND_COLOR};padding-left:10px;margin:20px 0 10px">$1</h2>`)
    // H3 → Sub-heading
    .replace(/^### (.+)$/gm, `<h3 style="font-size:16px;font-weight:bold;color:#444;margin:16px 0 8px">$1</h3>`)
    // Bold
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${BRAND_COLOR}">$1</strong>`)
    // Italic
    .replace(/\*(.+?)\*/g, `<em style="color:#666">$1</em>`)
    // Inline code
    .replace(/`([^`]+)`/g, `<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;font-family:monospace;font-size:13px;color:#e83e8c">$1</code>`)
    // Code block
    .replace(/```[\w]*\n([\s\S]*?)```/gm, `<pre style="background:#1e1e2e;color:#cdd6f4;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;margin:12px 0"><code>$1</code></pre>`)
    // Blockquote
    .replace(/^> (.+)$/gm, `<blockquote style="background:${LIGHT_BG};border-left:3px solid ${ACCENT_COLOR};padding:10px 16px;margin:12px 0;color:#555;font-style:italic">$1</blockquote>`)
    // Horizontal rule
    .replace(/^---$/gm, `<hr style="border:none;border-top:2px solid #ede9fe;margin:20px 0">`)
    // Unordered list items
    .replace(/^\- (.+)$/gm, `<li style="margin:6px 0;padding-left:4px;color:${TEXT_COLOR}">$1</li>`)
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, `<li style="margin:6px 0;padding-left:4px;color:${TEXT_COLOR}">$1</li>`)
    // Links (WeChat doesn't support external links in articles, wrap as text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<span style="color:${BRAND_COLOR};text-decoration:underline">$1</span>`)
    // Wrap consecutive <li> tags in <ul>
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, `<ul style="padding-left:18px;margin:8px 0">$1</ul>`)
    // Paragraphs: double newline → <p>
    .replace(/\n\n([^<])/g, `\n\n<p style="font-size:15px;line-height:1.8;color:${TEXT_COLOR};margin:10px 0">$1`)
    .replace(/([^>])\n\n/g, `$1</p>\n\n`);

  // Wrap in a container div
  const wrapped = `<section style="font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Helvetica Neue',sans-serif;max-width:680px;margin:0 auto;padding:0 16px;color:${TEXT_COLOR};line-height:1.8">
<!-- PodAha | podaha.com -->
${html}
<p style="text-align:center;color:#999;font-size:12px;margin-top:32px">— END —<br>更多 AI 播客工具，访问 podaha.com</p>
</section>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>WeChat Article Preview</title>
</head>
<body style="background:#f9f9f9;padding:20px">
<div style="max-width:680px;margin:0 auto;background:#fff;padding:24px;border-radius:8px">
${wrapped}
</div>
<p style="text-align:center;color:#aaa;font-size:12px;margin-top:12px">
  ↑ 复制上方内容，粘贴到微信公众号编辑器
</p>
</body></html>`;
}
