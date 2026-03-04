#!/usr/bin/env node
// PodAha 多平台分发工具
//
// 格式化模式（默认）:
//   node index.js articles/my-article.md
//   node index.js articles/my-article.md --format-only
//
// 发布模式（自动调用各平台 API）:
//   node index.js articles/my-article.md --publish --platform=devto,hashnode
//   node index.js articles/my-article.md --publish --lang=zh --platform=baijiahao,csdn
//   node index.js articles/my-article.md --publish --lang=en   # 发布所有英文平台
//   node index.js articles/my-article.md --publish --lang=zh   # 发布所有中文平台
//   node index.js articles/my-article.md --publish             # 发布所有平台（需全部 env）
//
// 支持平台:
//   英文: devto, medium, twitter, reddit, hashnode
//   中文: baijiahao, csdn, toutiao, sohu, zhihu, jianshu

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';

import { formatWechat }    from './formatters/wechat.js';
import { formatBaijiahao } from './formatters/baijiahao.js';
import { formatZhihu }     from './formatters/zhihu.js';
import { formatJuejin }    from './formatters/juejin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CLI 参数解析 ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const inputPath = args.find(a => !a.startsWith('--'));
const flagPublish    = args.includes('--publish');
const flagFormatOnly = args.includes('--format-only') || !flagPublish;

const langFlag = args.find(a => a.startsWith('--lang='))?.split('=')[1];        // en | zh
const platformFlag = args.find(a => a.startsWith('--platform='))?.split('=')[1]; // comma list
const draftFlag = args.includes('--draft');  // 发草稿而非正式发布

if (!inputPath) {
  console.error('Usage: node index.js <article.md> [--publish] [--lang=en|zh] [--platform=devto,hashnode]');
  process.exit(1);
}
if (!existsSync(inputPath)) {
  console.error(`File not found: ${inputPath}`);
  process.exit(1);
}

const raw = readFileSync(inputPath, 'utf8');
const name = basename(inputPath, '.md');

// ─── 解析 Frontmatter ─────────────────────────────────────────────────────────
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const [k, ...v] = line.split(':');
    if (k && v.length) meta[k.trim()] = v.join(':').trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: match[2] };
}

const { meta, body } = parseFrontmatter(raw);
const title = meta.title || name;
const markdownContent = body.trim();

// ─── 格式化输出 ───────────────────────────────────────────────────────────────
if (flagFormatOnly || !flagPublish) {
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
  console.log(`  知乎/掘金: 直接上传 .md 文件或复制内容`);
  console.log(`\n自动发布: node index.js ${inputPath} --publish\n`);
  console.log(`生成时间: ${dayjs().format('YYYY-MM-DD HH:mm')}\n`);
  process.exit(0);
}

// ─── 自动发布模式 ─────────────────────────────────────────────────────────────
console.log(`\n🚀 PodAha 自动发布\n`);
console.log(`📄 文章: ${inputPath}  |  标题: ${title}`);
console.log(`📅 时间: ${dayjs().format('YYYY-MM-DD HH:mm')}`);
if (draftFlag) console.log(`📝 模式: 草稿（不公开发布）`);
console.log();

// 平台注册表
const PUBLISHERS = {
  // ── 英文平台 ──────────────────────────────────────────────────────────────
  devto: {
    lang: 'en',
    label: 'Dev.to',
    envRequired: ['DEVTO_API_KEY'],
    load: () => import('./publishers/en/devto.js').then(m => m.publishToDevto),
    buildArticle: () => ({
      title,
      bodyMarkdown: markdownContent,
      tags: (meta.tags || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 4),
      published: !draftFlag,
      canonicalUrl: meta.canonical_url || '',
      description: meta.description || '',
    }),
  },
  medium: {
    lang: 'en',
    label: 'Medium',
    envRequired: ['MEDIUM_TOKEN'],
    load: () => import('./publishers/en/medium.js').then(m => m.publishToMedium),
    buildArticle: () => ({
      title,
      contentFormat: 'markdown',
      content: markdownContent,
      tags: (meta.tags || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 5),
      publishStatus: draftFlag ? 'draft' : 'public',
      canonicalUrl: meta.canonical_url || undefined,
    }),
  },
  twitter: {
    lang: 'en',
    label: 'Twitter/X',
    envRequired: ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_TOKEN_SECRET'],
    load: () => import('./publishers/en/twitter.js').then(m => m.postTweet),
    buildArticle: () => meta.tweet || `${title}\n\npodaha.com`,
  },
  reddit: {
    lang: 'en',
    label: 'Reddit',
    envRequired: ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'REDDIT_USERNAME', 'REDDIT_PASSWORD'],
    load: () => import('./publishers/en/reddit.js').then(m => m.submitRedditPost),
    buildArticle: () => ({
      subreddit: meta.reddit_subreddit || 'indiehackers',
      title,
      text: markdownContent,
      kind: 'self',
    }),
  },
  hashnode: {
    lang: 'en',
    label: 'Hashnode',
    envRequired: ['HASHNODE_TOKEN', 'HASHNODE_PUBLICATION_ID'],
    load: () => import('./publishers/en/hashnode.js').then(m => m.publishToHashnode),
    buildArticle: () => ({
      title,
      contentMarkdown: markdownContent,
      tags: (meta.tags || '').split(',').map(t => t.trim()).filter(Boolean)
        .slice(0, 5).map(t => ({ name: t, slug: t.toLowerCase().replace(/\s+/g, '-') })),
      coverImageURL: meta.cover_image || undefined,
      originalArticleURL: meta.canonical_url || undefined,
      isDraft: draftFlag,
    }),
  },

  // ── 中文平台 ──────────────────────────────────────────────────────────────
  baijiahao: {
    lang: 'zh',
    label: '百家号',
    envRequired: ['BAIJIAHAO_APP_ID', 'BAIJIAHAO_APP_TOKEN'],
    load: () => import('./publishers/cn/baijiahao.js').then(m => m.publishToBaijiahao),
    buildArticle: () => ({
      title,
      content: markdownContent, // baijiahao.js accepts markdown; platform converts
      isOriginal: 1,
    }),
  },
  csdn: {
    lang: 'zh',
    label: 'CSDN',
    envRequired: ['CSDN_COOKIE'],
    load: () => import('./publishers/cn/csdn.js').then(m => m.publishToCsdn),
    buildArticle: () => ({
      title,
      markdownContent,
      tags: (meta.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      status: draftFlag ? 0 : 1,
      description: meta.description || '',
    }),
  },
  toutiao: {
    lang: 'zh',
    label: '头条号',
    envRequired: ['TOUTIAO_COOKIE'],
    load: () => import('./publishers/cn/cookie-platforms.js').then(m => m.publishToToutiao),
    buildArticle: () => ({
      title,
      content: markdownContent,
      coverImageUrl: meta.cover_image || undefined,
    }),
  },
  sohu: {
    lang: 'zh',
    label: '搜狐号',
    envRequired: ['SOHU_COOKIE'],
    load: () => import('./publishers/cn/cookie-platforms.js').then(m => m.publishToSohu),
    buildArticle: () => ({ title, content: markdownContent }),
  },
  zhihu: {
    lang: 'zh',
    label: '知乎专栏',
    envRequired: ['ZHIHU_COOKIE'],
    load: () => import('./publishers/cn/cookie-platforms.js').then(m => m.publishToZhihu),
    buildArticle: () => ({ title, content: markdownContent }),
  },
  jianshu: {
    lang: 'zh',
    label: '简书',
    envRequired: ['JIANSHU_COOKIE'],
    load: () => import('./publishers/cn/cookie-platforms.js').then(m => m.publishToJianshu),
    buildArticle: () => ({ title, content: markdownContent }),
  },
};

// 确定要发布的平台列表
let targetPlatforms = Object.keys(PUBLISHERS);
if (platformFlag) {
  targetPlatforms = platformFlag.split(',').map(p => p.trim().toLowerCase());
  const unknown = targetPlatforms.filter(p => !PUBLISHERS[p]);
  if (unknown.length) {
    console.error(`未知平台: ${unknown.join(', ')}`);
    console.error(`支持平台: ${Object.keys(PUBLISHERS).join(', ')}`);
    process.exit(1);
  }
} else if (langFlag) {
  targetPlatforms = targetPlatforms.filter(p => PUBLISHERS[p].lang === langFlag);
}

// 检查 env 是否齐全
function checkEnv(envList) {
  const missing = envList.filter(k => !process.env[k]);
  return missing;
}

// ─── 并行发布 ─────────────────────────────────────────────────────────────────
const results = [];

async function runPlatform(key) {
  const cfg = PUBLISHERS[key];
  const missing = checkEnv(cfg.envRequired);
  if (missing.length) {
    return { key, label: cfg.label, status: 'skipped', reason: `缺少环境变量: ${missing.join(', ')}` };
  }

  try {
    const fn = await cfg.load();
    const article = cfg.buildArticle();
    const result = await fn(article);
    return { key, label: cfg.label, status: 'ok', result };
  } catch (e) {
    return { key, label: cfg.label, status: 'error', reason: e.message };
  }
}

console.log(`发布平台 (${targetPlatforms.length}): ${targetPlatforms.map(k => PUBLISHERS[k].label).join(', ')}\n`);

// 串行执行（避免 cookie 类平台频率触发）
for (const key of targetPlatforms) {
  process.stdout.write(`  ⏳ ${PUBLISHERS[key].label.padEnd(12)}`);
  const r = await runPlatform(key);
  results.push(r);

  if (r.status === 'ok') {
    const url = r.result?.url || r.result?.articleId || '';
    console.log(`✅  ${url}`);
    if (r.result?.note) console.log(`      ⚠️  ${r.result.note}`);
  } else if (r.status === 'skipped') {
    console.log(`⏭️   ${r.reason}`);
  } else {
    console.log(`❌  ${r.reason}`);
  }
}

// ─── 摘要 ─────────────────────────────────────────────────────────────────────
const ok      = results.filter(r => r.status === 'ok').length;
const skipped = results.filter(r => r.status === 'skipped').length;
const failed  = results.filter(r => r.status === 'error').length;

console.log(`\n─────────────────────────────────────────`);
console.log(`✅ 成功: ${ok}  ⏭️  跳过: ${skipped}  ❌ 失败: ${failed}`);
if (skipped) {
  console.log(`\n提示: 跳过的平台需在 .env 中配置对应 Token/Cookie`);
  console.log(`参考: distributor/.env.example`);
}
console.log();
