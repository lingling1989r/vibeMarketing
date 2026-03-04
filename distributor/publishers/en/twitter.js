// Twitter/X Publisher
// API: v2, Free tier (write-only: 1500 posts/month)
// Auth: OAuth 2.0 App-Only OR OAuth 1.0a User Context
// Env: TWITTER_BEARER_TOKEN + TWITTER_API_KEY + TWITTER_API_SECRET
//      TWITTER_ACCESS_TOKEN + TWITTER_ACCESS_TOKEN_SECRET
// Note: Free tier supports POST /2/tweets only (no image upload in free tier)
//       Basic tier ($200/mo) or pay-per-use credits needed for media upload

export async function postTweet(text, options = {}) {
  const {
    replyToId,    // tweet ID to reply to (for threads)
    mediaIds,     // array of uploaded media IDs (needs Basic+ for media upload)
    poll,         // { options: ['A','B'], duration_minutes: 1440 }
  } = options;

  const bearer = process.env.TWITTER_BEARER_TOKEN;
  if (!bearer) throw new Error('TWITTER_BEARER_TOKEN not set');

  // For user context (posting as yourself), need OAuth 1.0a
  // Using Bearer is app-only and can only read, not write.
  // Writing tweets requires OAuth 1.0a user credentials:
  const apiKey    = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken  = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error('Twitter OAuth 1.0a credentials not set. Need: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET');
  }

  const body = { text };
  if (replyToId) body.reply = { in_reply_to_tweet_id: replyToId };
  if (mediaIds?.length) body.media = { media_ids: mediaIds };
  if (poll) body.poll = poll;

  // OAuth 1.0a signing
  const authHeader = buildOAuth1Header('POST', 'https://api.twitter.com/2/tweets', {}, {
    apiKey, apiSecret, accessToken, accessSecret,
  });

  const res = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twitter API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    platform: 'twitter',
    id: data.data.id,
    url: `https://twitter.com/i/web/status/${data.data.id}`,
    text: data.data.text,
  };
}

/**
 * Post a thread (array of tweet texts) — each replies to previous
 */
export async function postThread(tweets) {
  if (!Array.isArray(tweets) || tweets.length === 0) {
    throw new Error('tweets must be a non-empty array');
  }

  const results = [];
  let lastId = null;

  for (const text of tweets) {
    const result = await postTweet(text, lastId ? { replyToId: lastId } : {});
    results.push(result);
    lastId = result.id;
    // Small delay between tweets to avoid rate limits
    await new Promise(r => setTimeout(r, 1500));
  }

  return results;
}

// ─── Minimal OAuth 1.0a implementation ──────────────────────────────────────
function buildOAuth1Header(method, url, params, creds) {
  const { apiKey, apiSecret, accessToken, accessSecret } = creds;
  const nonce = Math.random().toString(36).slice(2) + Date.now();
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const allParams = { ...params, ...oauthParams };
  const paramStr = Object.keys(allParams).sort()
    .map(k => `${encode(k)}=${encode(allParams[k])}`).join('&');

  const baseStr = `${method}&${encode(url)}&${encode(paramStr)}`;
  const signingKey = `${encode(apiSecret)}&${encode(accessSecret)}`;

  // HMAC-SHA1 via WebCrypto (Node.js 18+ has globalThis.crypto)
  // For simplicity, using a manual implementation hint
  // In production: use 'oauth-1.0a' npm package
  // npm install oauth-1.0a crypto
  throw new Error('OAuth 1.0a signing requires the "oauth-1.0a" package. Run: npm install oauth-1.0a');

  // Recommended: replace this function with:
  // import OAuth from 'oauth-1.0a';
  // import crypto from 'crypto';
  // const oauth = new OAuth({ consumer: {key, secret}, signature_method: 'HMAC-SHA1',
  //   hash_function(base, key) { return crypto.createHmac('sha1', key).update(base).digest('base64'); }});
  // return oauth.toHeader(oauth.authorize({url, method}, {key: accessToken, secret: accessSecret})).Authorization;
}

function encode(str) {
  return encodeURIComponent(String(str)).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}
