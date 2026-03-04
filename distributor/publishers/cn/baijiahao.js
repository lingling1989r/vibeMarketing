// 百家号 Publisher
// 官方 API：https://baijiahao.baidu.com/builderinner/open/resource/article/publish
// 认证：app_id + app_token（申请地址：https://baijiahao.baidu.com/builder/author/openauth/）
// 环境变量：BAIJIAHAO_APP_ID, BAIJIAHAO_APP_TOKEN

export async function publishToBaijiahao(article) {
  const appId    = process.env.BAIJIAHAO_APP_ID;
  const appToken = process.env.BAIJIAHAO_APP_TOKEN;
  if (!appId || !appToken) {
    throw new Error('BAIJIAHAO_APP_ID 和 BAIJIAHAO_APP_TOKEN 未设置\n申请地址：https://baijiahao.baidu.com/builder/author/openauth/');
  }

  const {
    title,
    content,        // 富文本 HTML，限 20000 字
    originUrl = '', // 原文地址
    coverImages = [],  // [{src: 'url'}]，0-3张，最小 218×146
    isOriginal = 1,    // 1=原创，0=非原创
  } = article;

  if (title.length < 8 || title.length > 40) {
    throw new Error('百家号标题需 8-40 个字符');
  }

  const payload = {
    app_id:       appId,
    app_token:    appToken,
    title,
    content,
    origin_url:   originUrl,
    cover_images: coverImages.slice(0, 3),
    is_original:  isOriginal,
  };

  const res = await fetch('https://baijiahao.baidu.com/builderinner/open/resource/article/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`百家号 API 错误 ${res.status}: ${await res.text()}`);

  const data = await res.json();
  if (data.errno !== 0) {
    throw new Error(`百家号发布失败: ${data.errmsg || JSON.stringify(data)}`);
  }

  return {
    platform: 'baijiahao',
    articleId: data.data?.article_id,
    title,
  };
}
