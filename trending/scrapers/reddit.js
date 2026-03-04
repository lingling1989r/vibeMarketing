// Reddit scraper - r/podcasting and r/podcasters top posts
// Uses Reddit public JSON API (no auth needed)

const SUBREDDITS = ['podcasting', 'podcasters', 'indiehackers', 'SideProject'];

async function fetchSubreddit(sub) {
  const url = `https://www.reddit.com/r/${sub}/top.json?t=day&limit=10`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PodAhaResearch/1.0 (content operations bot)',
      },
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json();
    return (json?.data?.children ?? []).map((c, i) => {
      const p = c.data;
      return {
        rank: i + 1,
        title: p.title ?? '',
        summary: p.selftext?.slice(0, 200) ?? '',
        hot: p.score ?? 0,
        comments: p.num_comments ?? 0,
        url: `https://www.reddit.com${p.permalink}`,
        subreddit: sub,
        platform: `Reddit r/${sub}`,
        lang: 'en',
      };
    });
  } catch (e) {
    console.error(`  ✗ Reddit r/${sub}: ${e.message}`);
    return [];
  }
}

export async function fetchReddit() {
  const results = await Promise.all(SUBREDDITS.map(fetchSubreddit));
  return results.flat();
}
