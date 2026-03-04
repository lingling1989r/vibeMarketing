// 百度实时热搜 scraper
// API: https://top.baidu.com/api/board?platform=wise&tab=realtime

export async function fetchBaidu() {
  try {
    const res = await fetch(
      'https://top.baidu.com/api/board?platform=wise&tab=realtime',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
          Referer: 'https://top.baidu.com/',
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    const json = await res.json();
    const items = json?.data?.cards?.[0]?.content ?? [];
    return items.slice(0, 25).map((item, i) => ({
      rank: i + 1,
      title: item.word ?? item.title ?? '',
      summary: item.desc ?? '',
      hot: Number(item.hotScore ?? item.heat ?? 0),
      url: item.url ?? `https://www.baidu.com/s?wd=${encodeURIComponent(item.word)}`,
      platform: '百度热搜',
      lang: 'zh',
    }));
  } catch (e) {
    console.error(`  ✗ 百度: ${e.message}`);
    return [];
  }
}
