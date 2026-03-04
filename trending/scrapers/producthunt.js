// Product Hunt - today's top products
// Uses PH public RSS feed (no auth needed)

export async function fetchProductHunt() {
  try {
    const res = await fetch('https://www.producthunt.com/feed', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        Accept: 'application/rss+xml, application/xml',
      },
      signal: AbortSignal.timeout(8000),
    });
    const xml = await res.text();

    // Simple XML parsing without extra deps
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let rank = 1;
    while ((match = itemRegex.exec(xml)) !== null && rank <= 20) {
      const block = match[1];
      const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ??
        block.match(/<title>(.*?)<\/title>/))?.[1]?.trim() ?? '';
      const link = (block.match(/<link>(.*?)<\/link>/))?.[1]?.trim() ?? '';
      const desc = (block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ??
        block.match(/<description>(.*?)<\/description>/))?.[1]
        ?.replace(/<[^>]+>/g, '')
        ?.trim()
        ?.slice(0, 200) ?? '';

      if (title) {
        items.push({
          rank: rank++,
          title,
          summary: desc,
          hot: 0,
          url: link,
          platform: 'Product Hunt',
          lang: 'en',
        });
      }
    }
    return items;
  } catch (e) {
    console.error(`  ✗ ProductHunt: ${e.message}`);
    return [];
  }
}
