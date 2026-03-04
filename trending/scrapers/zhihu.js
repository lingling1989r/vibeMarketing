// 知乎热榜 scraper
// API: https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total

export async function fetchZhihu() {
  try {
    const res = await fetch(
      'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'x-api-version': '3.0.40',
          Referer: 'https://www.zhihu.com/',
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    const json = await res.json();
    return (json?.data ?? []).slice(0, 25).map((item, i) => {
      const t = item.target ?? {};
      const id = t.id ?? '';
      const url = t.type === 'question'
        ? `https://www.zhihu.com/question/${id}`
        : `https://www.zhihu.com/`;
      return {
        rank: i + 1,
        title: t.title ?? t.name ?? '',
        summary: t.excerpt ?? '',
        hot: Number((item.detail_text ?? '').replace(/[^0-9]/g, '')) || 0,
        url,
        platform: '知乎热榜',
        lang: 'zh',
      };
    });
  } catch (e) {
    console.error(`  ✗ 知乎: ${e.message}`);
    return [];
  }
}
