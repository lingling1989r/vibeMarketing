// Medium Publisher
// API Docs: https://github.com/Medium/medium-api-docs
// Auth: Integration token (Bearer)
// Env: MEDIUM_TOKEN
// Note: Medium API only supports creating posts under your own profile.
//       Get token from: Settings → Security → Integration tokens

export async function getMediaumUserId(token) {
  const res = await fetch('https://api.medium.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Medium auth failed: ${res.status}`);
  const data = await res.json();
  return data.data.id;
}

export async function publishToMedium(article, options = {}) {
  const token = process.env.MEDIUM_TOKEN;
  if (!token) throw new Error('MEDIUM_TOKEN not set');

  const {
    title,
    contentFormat = 'markdown',  // 'html' or 'markdown'
    content,
    tags = ['podcast', 'ai', 'productivity'],
    publishStatus = 'draft',     // 'public' | 'draft' | 'unlisted'
    canonicalUrl,
  } = article;

  // Get user ID first
  const userId = await getMediaumUserId(token);

  const payload = {
    title,
    contentFormat,
    content,
    tags: tags.slice(0, 5),
    publishStatus,
    ...(canonicalUrl && { canonicalUrl }),
  };

  const res = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Medium API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    platform: 'medium',
    id: data.data.id,
    url: data.data.url,
    title: data.data.title,
    published: data.data.publishStatus,
  };
}
