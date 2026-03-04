// 稀土掘金热榜 scraper
// API: https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed

export async function fetchJuejin() {
  try {
    const res = await fetch(
      'https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed?client_type=2608',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          Referer: 'https://juejin.cn/',
        },
        body: JSON.stringify({
          id_type: 2,
          sort_type: 200,  // hot
          cursor: '0',
          limit: 20,
        }),
        signal: AbortSignal.timeout(8000),
      }
    );
    const json = await res.json();
    return (json?.data ?? []).slice(0, 20).map((item, i) => {
      const a = item.item_info?.article_info ?? {};
      const t = item.item_info?.tags?.[0] ?? {};
      return {
        rank: i + 1,
        title: a.title ?? '',
        summary: a.brief_content ?? '',
        hot: Number(a.view_count ?? 0),
        url: `https://juejin.cn/post/${a.article_id ?? ''}`,
        tag: t.tag_name ?? '',
        platform: '稀土掘金',
        lang: 'zh',
      };
    }).filter(x => x.title);
  } catch (e) {
    console.error(`  ✗ 掘金: ${e.message}`);
    return [];
  }
}
