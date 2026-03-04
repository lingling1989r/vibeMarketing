#!/usr/bin/env node
// Multi-platform content formatter
// Usage: node index.js articles/my-article.md
//
// Output: dist/<article-name>/
//   ├── wechat.html        → 粘贴到微信公众号编辑器
//   ├── baijiahao.txt      → 粘贴到百家号/头条号
//   ├── sohu.txt           → 粘贴到搜狐号
//   ├── zhihu.md           → 知乎专栏（保留 Markdown）
//   └── juejin.md          → 稀土掘金（技术风格）

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';

import { formatWechat }    from './formatters/wechat.js';
import { formatBaijiahao } from './formatters/baijiahao.js';
import { formatZhihu }     from './formatters/zhihu.js';
import { formatJuejin }    from './formatters/juejin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node index.js articles/<article.md>');
  process.exit(1);
}
if (!existsSync(inputPath)) {
  console.error(`File not found: ${inputPath}`);
  process.exit(1);
}

const raw = readFileSync(inputPath, 'utf8');
const name = basename(inputPath, '.md');
const outDir = join(__dirname, 'dist', name);
mkdirSync(outDir, { recursive: true });

console.log(`\n📤 PodAha 多平台分发工具\n`);
console.log(`📄 文章: ${inputPath}`);
console.log(`📁 输出目录: dist/${name}/\n`);

const platforms = [
  { name: '微信公众号', file: 'wechat.html',    fn: formatWechat },
  { name: '百家号/头条', file: 'baijiahao.txt',  fn: formatBaijiahao },
  { name: '搜狐号',     file: 'sohu.txt',       fn: (m) => formatBaijiahao(m, '搜狐') },
  { name: '知乎专栏',   file: 'zhihu.md',       fn: formatZhihu },
  { name: '稀土掘金',   file: 'juejin.md',      fn: formatJuejin },
];

for (const p of platforms) {
  try {
    const output = p.fn(raw);
    const filePath = join(outDir, p.file);
    writeFileSync(filePath, output, 'utf8');
    const size = (output.length / 1024).toFixed(1);
    console.log(`  ✓ ${p.name.padEnd(10)} → dist/${name}/${p.file}  (${size} KB)`);
  } catch (e) {
    console.error(`  ✗ ${p.name}: ${e.message}`);
  }
}

console.log(`\n✅ 分发包已生成: dist/${name}/`);
console.log(`\n发布指南:`);
console.log(`  微信公众号: 打开 wechat.html，复制全部内容粘贴到公众号编辑器`);
console.log(`  百家号/头条: 打开 baijiahao.txt，复制内容到对应平台编辑器`);
console.log(`  搜狐号: 打开 sohu.txt，复制内容到搜狐号编辑器`);
console.log(`  知乎/掘金: 直接上传 .md 文件或复制内容\n`);
console.log(`生成时间: ${dayjs().format('YYYY-MM-DD HH:mm')}\n`);
