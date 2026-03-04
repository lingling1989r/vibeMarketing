// Content Generator — Claude API assisted drafting
// Usage: node generator.js "topic" --channel wechat --lang zh
//        node generator.js "topic" --channel twitter --lang en

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dayjs from 'dayjs';

const __dir = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const topic = args.find(a => !a.startsWith('--'));
const channel = args.find(a => a.startsWith('--channel='))?.split('=')[1] || 'wechat';
const lang = args.find(a => a.startsWith('--lang='))?.split('=')[1] || 'zh';

if (!topic) {
  console.error('Usage: node generator.js "topic" --channel wechat --lang zh');
  process.exit(1);
}

// Channel-specific prompts
const CHANNEL_PROMPTS = {
  wechat: {
    style: '公众号故事体：以个人视角讲故事，开头要有冲突/悬念，情感共鸣，最后引出产品自然不突兀。2000-3000字。',
    format: 'Markdown，含小标题',
  },
  zhihu: {
    style: '知乎专业回答：从专业角度切入，有数据支撑，结构清晰（背景→分析→建议→总结），适当引用案例。1000-2000字。',
    format: 'Markdown，含小标题',
  },
  twitter: {
    style: 'Twitter/X thread for indie podcast creators and indie developers. Data-driven, dry, punchy. No fluff. Each tweet max 280 chars.',
    format: '7-tweet thread format: 1/7, 2/7 ... 7/7. Hook in first tweet.',
  },
  devto: {
    style: 'Technical blog post for developers. Practical, code-optional, with clear takeaways. First person but professional.',
    format: 'Markdown with headers, code blocks if relevant, TL;DR at top',
  },
  medium: {
    style: 'Medium article for general tech audience. Narrative style, personal experience mixed with data, accessible.',
    format: 'Markdown with headers. 1000-1500 words.',
  },
  reddit: {
    style: 'Reddit post for r/podcasting or r/SideProject. Casual, authentic, community-first. NOT a sales pitch. Ask for input.',
    format: 'Short headline + body. 300-500 words max.',
  },
  linkedin: {
    style: 'LinkedIn post. Professional but personal story. Start with a hook. Short paragraphs.',
    format: '500-800 words. No markdown headers (LinkedIn renders badly). Use line breaks.',
  },
  baijiahao: {
    style: '百家号/头条号文章：面向大众读者，标题吸引眼球，内容接地气，适合偏大众化的文章分发平台。',
    format: 'Markdown，纯文本为主，不用复杂格式',
  },
  csdn: {
    style: 'CSDN技术博客：面向程序员和技术人群，可以稍微技术向，数据/工具对比型内容为主。',
    format: 'Markdown，含代码块和结构化列表',
  },
};

const PRODUCT_CONTEXT = `
PodAha (podaha.com) is an AI-powered podcast post-production platform.
- Cuts post-production from 5-8 hours to under 1 hour
- Features: AI noise removal, auto-transcript, show notes generation, social clips, 1-click publish to Spotify & Apple
- Target users: indie podcasters, solo creators, developer-podcasters
- Key data: 72% of podcasters quit before finding audience; avg 10 episodes then quit
- Free to start, no credit card
- PH launch in 2 weeks
`;

async function generate() {
  const channelConfig = CHANNEL_PROMPTS[channel] || CHANNEL_PROMPTS.wechat;
  const client = new Anthropic();

  console.log(`\nGenerating ${channel} (${lang}) content for: "${topic}"\n`);

  const prompt = lang === 'zh'
    ? `你是 PodAha 的内容运营，正在为以下话题创作内容。

产品背景：
${PRODUCT_CONTEXT}

话题：${topic}
渠道：${channel}
风格要求：${channelConfig.style}
格式要求：${channelConfig.format}

请直接输出内容，不要有任何前言或解释。`
    : `You are the content marketer for PodAha. Write content for the following.

Product context:
${PRODUCT_CONTEXT}

Topic: ${topic}
Channel: ${channel}
Style: ${channelConfig.style}
Format: ${channelConfig.format}

Output the content directly. No preamble or explanation.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0].text;

  // Save to library
  const slug = topic.slice(0, 40).replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, '-').toLowerCase();
  const date = dayjs().format('YYYY-MM-DD');
  const dir = join(__dir, 'library', lang);
  mkdirSync(dir, { recursive: true });
  const filename = `${date}-${channel}-${slug}.md`;
  const filepath = join(dir, filename);

  const frontmatter = `---
date: ${date}
topic: ${topic}
channel: ${channel}
lang: ${lang}
status: draft
---\n\n`;

  writeFileSync(filepath, frontmatter + content, 'utf-8');
  console.log(content);
  console.log(`\n\n✅ Saved to: content/library/${lang}/${filename}`);
  console.log(`📋 Next: review, then run distributor to publish`);
}

generate().catch(err => {
  if (err.message?.includes('ANTHROPIC_API_KEY')) {
    console.error('Set ANTHROPIC_API_KEY environment variable (or use OpenClaw)');
  } else {
    console.error(err.message);
  }
  process.exit(1);
});
