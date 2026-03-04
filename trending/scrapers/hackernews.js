// Hacker News Top Stories scraper
// Uses official Firebase API - very stable

const HN_TOP = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

export async function fetchHackerNews(limit = 30) {
  try {
    const idsRes = await fetch(HN_TOP, { signal: AbortSignal.timeout(8000) });
    const ids = await idsRes.json();
    const top = ids.slice(0, limit);

    const items = await Promise.allSettled(
      top.map((id) =>
        fetch(HN_ITEM(id), { signal: AbortSignal.timeout(5000) }).then((r) => r.json())
      )
    );

    return items
      .filter((r) => r.status === 'fulfilled' && r.value?.title)
      .map((r, i) => {
        const item = r.value;
        return {
          rank: i + 1,
          title: item.title ?? '',
          summary: '',
          hot: item.score ?? 0,
          comments: item.descendants ?? 0,
          url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
          hn_url: `https://news.ycombinator.com/item?id=${item.id}`,
          platform: 'Hacker News',
          lang: 'en',
        };
      });
  } catch (e) {
    console.error(`  ✗ HackerNews: ${e.message}`);
    return [];
  }
}
