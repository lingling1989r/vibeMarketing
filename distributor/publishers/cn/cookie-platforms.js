// Cookie-based Publishers for: 搜狐号, 头条号, 知乎专栏, 简书
// 参考 WechatSync: github.com/wechatsync/Wechatsync
// 认证：浏览器 Cookie（无开放 API）
//
// 获取 Cookie 步骤（各平台通用）：
// 1. 登录对应平台
// 2. F12 → Network → 找到 API 请求 → 复制 Request Headers 里的 Cookie 字段
// 3. 填入 .env

// ─── 搜狐号 ─────────────────────────────────────────────────────────────────
export async function publishToSohu(article) {
  const cookie = process.env.SOHU_COOKIE;
  if (!cookie) throw new Error('SOHU_COOKIE 未设置\n登录 mp.sohu.com → F12 → 复制 Cookie');

  // Step 1: 获取账号信息
  const infoRes = await fetch('https://mp.sohu.com/mpbp/bp/account/register-info', {
    headers: { Cookie: cookie, Referer: 'https://mp.sohu.com' },
  });
  if (!infoRes.ok) throw new Error(`搜狐获取账号信息失败: ${infoRes.status}`);
  const info = await infoRes.json();
  const accountId = info?.data?.id;
  if (!accountId) throw new Error('搜狐：无法获取 accountId，Cookie 可能已过期');

  // Step 2: 创建草稿
  const { title, content } = article;
  const payload = {
    accountId,
    title,
    content,
    contentType: 'article',
    isOriginal: 1,
    coverPics: [],
  };

  const draftRes = await fetch('https://mp.sohu.com/mpbp/bp/news/v4/news/draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      Origin: 'https://mp.sohu.com',
      Referer: 'https://mp.sohu.com',
    },
    body: JSON.stringify(payload),
  });

  if (!draftRes.ok) throw new Error(`搜狐发布失败: ${draftRes.status}`);
  const data = await draftRes.json();

  return {
    platform: 'sohu',
    draftId: data?.data?.nid,
    title,
    note: '已创建草稿，请登录 mp.sohu.com 手动发布',
  };
}

// ─── 头条号 ─────────────────────────────────────────────────────────────────
export async function publishToToutiao(article) {
  const cookie = process.env.TOUTIAO_COOKIE;
  if (!cookie) throw new Error('TOUTIAO_COOKIE 未设置\n登录 mp.toutiao.com → F12 → 复制 Cookie');

  const { title, content, coverImageUrl } = article;

  // 处理封面图
  let pgcImageInfo = null;
  if (coverImageUrl) {
    // 头条用图片抓取接口
    const catchRes = await fetch(`https://mp.toutiao.com/tools/catch_picture/?url=${encodeURIComponent(coverImageUrl)}`, {
      headers: { Cookie: cookie },
    });
    if (catchRes.ok) {
      const catchData = await catchRes.json();
      if (catchData?.data?.web_image_uri) {
        pgcImageInfo = { web_uri: catchData.data.web_image_uri };
      }
    }
  }

  const payload = {
    pgc_title: title,
    content,
    article_type: 0,
    source: 'mp',
    isTopStory: 0,
    ...(pgcImageInfo && { pgc_image_info: [pgcImageInfo] }),
  };

  const res = await fetch('https://mp.toutiao.com/mp/agw/article/publish?source=mp&type=article', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      Referer: 'https://mp.toutiao.com',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`头条发布失败: ${res.status}`);
  const data = await res.json();

  return {
    platform: 'toutiao',
    articleId: data?.data?.article_id,
    title,
  };
}

// ─── 知乎专栏 ─────────────────────────────────────────────────────────────────
export async function publishToZhihu(article) {
  const cookie = process.env.ZHIHU_COOKIE;
  if (!cookie) throw new Error('ZHIHU_COOKIE 未设置\n登录 zhihu.com → F12 → 复制 Cookie');

  const { title, content } = article; // content 为 HTML

  // Step 1: 创建草稿
  const draftRes = await fetch('https://zhuanlan.zhihu.com/api/articles/drafts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      Referer: 'https://zhuanlan.zhihu.com',
    },
    body: JSON.stringify({ title }),
  });

  if (!draftRes.ok) throw new Error(`知乎创建草稿失败: ${draftRes.status}`);
  const draft = await draftRes.json();
  const draftId = draft?.id;

  // Step 2: 更新内容
  const editRes = await fetch(`https://zhuanlan.zhihu.com/api/articles/${draftId}/draft`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      Referer: 'https://zhuanlan.zhihu.com',
    },
    body: JSON.stringify({ title, content, delta_time: 1 }),
  });

  if (!editRes.ok) throw new Error(`知乎更新内容失败: ${editRes.status}`);

  return {
    platform: 'zhihu',
    draftId,
    url: `https://zhuanlan.zhihu.com/p/${draftId}`,
    title,
    note: '草稿已创建，请前往知乎专栏手动发布',
  };
}

// ─── 简书 ─────────────────────────────────────────────────────────────────────
export async function publishToJianshu(article) {
  const cookie = process.env.JIANSHU_COOKIE;
  if (!cookie) throw new Error('JIANSHU_COOKIE 未设置\n登录 jianshu.com → F12 → 复制 Cookie');

  const { title, content } = article;

  // 简书使用 markdown API（需要先获取 notebook_id）
  const notebookRes = await fetch('https://www.jianshu.com/author/notebooks', {
    headers: { Cookie: cookie, 'X-Requested-With': 'XMLHttpRequest' },
  });

  if (!notebookRes.ok) throw new Error(`简书获取笔记本失败: ${notebookRes.status}`);
  const notebooks = await notebookRes.json();
  const notebookId = notebooks?.[0]?.id;
  if (!notebookId) throw new Error('简书：无法获取笔记本 ID，Cookie 可能已过期');

  // 创建文章
  const createRes = await fetch(`https://www.jianshu.com/author/notebooks/${notebookId}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      'X-Requested-With': 'XMLHttpRequest',
      Referer: 'https://www.jianshu.com',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) throw new Error(`简书创建文章失败: ${createRes.status}`);
  const created = await createRes.json();
  const articleId = created?.id;

  // 更新内容
  await fetch(`https://www.jianshu.com/author/articles/${articleId}/content`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ title, content }),
  });

  return {
    platform: 'jianshu',
    articleId,
    url: `https://www.jianshu.com/p/${articleId}`,
    title,
    note: '草稿已创建，请前往简书手动发布',
  };
}
