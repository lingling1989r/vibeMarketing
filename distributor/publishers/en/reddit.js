// Reddit Publisher
// API: OAuth2, PRAW-compatible endpoints
// Auth: OAuth2 with script app credentials
// Env: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD
// Docs: https://www.reddit.com/dev/api/

const REDDIT_USER_AGENT = 'PodAha-Distributor/1.0';

async function getRedditToken() {
  const clientId     = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username     = process.env.REDDIT_USERNAME;
  const password     = process.env.REDDIT_PASSWORD;

  if (!clientId || !clientSecret || !username || !password) {
    throw new Error('Reddit credentials not set: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD');
  }

  const body = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
  });

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'User-Agent': REDDIT_USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) throw new Error(`Reddit auth failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Reddit auth error: ${data.error}`);
  return data.access_token;
}

export async function submitRedditPost(post) {
  const {
    subreddit,            // e.g. 'podcasting'
    title,
    text,                 // selftext (for text posts)
    url,                  // for link posts (omit for text posts)
    flair_id,             // optional
    nsfw = false,
    spoiler = false,
  } = post;

  const token = await getRedditToken();

  const body = new URLSearchParams({
    api_type: 'json',
    kind: url ? 'link' : 'self',
    sr: subreddit,
    title,
    ...(text && { text }),
    ...(url && { url }),
    ...(flair_id && { flair_id }),
    nsfw: nsfw ? '1' : '0',
    spoiler: spoiler ? '1' : '0',
    resubmit: 'true',
  });

  const res = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': REDDIT_USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Reddit submit error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const post_url = data.json?.data?.url;
  const post_id  = data.json?.data?.id;

  if (data.json?.errors?.length > 0) {
    throw new Error(`Reddit errors: ${JSON.stringify(data.json.errors)}`);
  }

  return {
    platform: 'reddit',
    id: post_id,
    url: post_url,
    subreddit,
    title,
  };
}

// Post to multiple subreddits (with delay to avoid spam filter)
export async function submitToSubreddits(title, text, subreddits = ['podcasting', 'SideProject']) {
  const results = [];
  for (const subreddit of subreddits) {
    try {
      const r = await submitRedditPost({ subreddit, title, text });
      results.push(r);
      console.log(`  ✅ r/${subreddit}: ${r.url}`);
    } catch (err) {
      console.error(`  ❌ r/${subreddit}: ${err.message}`);
      results.push({ platform: 'reddit', subreddit, error: err.message });
    }
    // Reddit rate limit: 1 post per 10min per subreddit, 6/hr globally
    if (subreddits.indexOf(subreddit) < subreddits.length - 1) {
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  return results;
}
