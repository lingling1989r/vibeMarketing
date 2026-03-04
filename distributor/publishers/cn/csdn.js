// CSDN Publisher
// 参考 WechatSync CSDN adapter: github.com/wechatsync/Wechatsync
// 认证：浏览器 Cookie + HMAC-SHA256 签名
// 环境变量：CSDN_COOKIE（从浏览器开发者工具复制）
//
// 获取 Cookie 步骤：
// 1. 登录 https://blog.csdn.net
// 2. F12 → Network → 随便找一个请求 → 复制 Request Headers 里的 Cookie 字段
// 3. 粘贴到 .env 的 CSDN_COOKIE=

import { createHmac } from 'crypto';

const CSDN_API_BASE = 'https://bizapi.csdn.net';
const CSDN_KEY = '203803574';  // WechatSync 中的固定 key
const CSDN_SECRET = '9znpamsyl2c7cdrr9sas0le9vbc3r6ba'; // WechatSync 中的固定签名 secret

function signCsdn(method, path, nonce) {
  const sigStr = [method, 'application/json', CSDN_KEY, nonce, path].join('\n');
  return createHmac('sha256', CSDN_SECRET).update(sigStr).digest('base64');
}

async function csdnFetch(path, body, cookie) {
  const nonce = Math.random().toString(36).slice(2);
  const sig = signCsdn('POST', path, nonce);

  const res = await fetch(`${CSDN_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      'x-ca-key': CSDN_KEY,
      'x-ca-nonce': nonce,
      'x-ca-signature': sig,
      'x-ca-signature-headers': 'x-ca-key,x-ca-nonce',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`CSDN API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function publishToCsdn(article) {
  const cookie = process.env.CSDN_COOKIE;
  if (!cookie) {
    throw new Error('CSDN_COOKIE 未设置\n获取方式：登录 blog.csdn.net → F12 → Network → 复制任意请求的 Cookie Header');
  }

  const {
    title,
    markdownContent,   // Markdown 正文
    tags = [],         // 标签数组，最多5个
    categoryId = '',   // 分类ID（可选）
    status = 0,        // 0=草稿, 1=发布
    isOriginal = 1,    // 1=原创, 2=转载, 4=翻译
    description = '',  // 文章摘要
  } = article;

  const payload = {
    title,
    markdowncontent: markdownContent,
    content: markdownContent, // CSDN 同时需要 content 字段
    tags: tags.slice(0, 5).join(','),
    status,
    categories: categoryId,
    is_new_article: 1,
    original_link: '',
    authorized_status: false,
    check_original: false,
    source: 'pc_mdeditor',
    type: 'original',
    original: isOriginal,
    not_auto_saved: 1,
    resource_url: '',
    description,
  };

  const data = await csdnFetch('/blog-console-api/v3/mdeditor/saveArticle', payload, cookie);

  if (data.code !== 200) {
    throw new Error(`CSDN 发布失败: ${data.message || JSON.stringify(data)}`);
  }

  return {
    platform: 'csdn',
    articleId: data.data?.article_id,
    url: `https://blog.csdn.net/${data.data?.article_id}`,
    title,
  };
}
