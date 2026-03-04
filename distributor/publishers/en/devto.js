// Dev.to Publisher
// API Docs: https://developers.forem.com/api
// Auth: API Key in header `api-key`
// Env: DEVTO_API_KEY

export async function publishToDevto(article, options = {}) {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) throw new Error('DEVTO_API_KEY not set');

  const {
    title,
    body_markdown,
    tags = ['podcast', 'ai', 'productivity', 'indiedev'],
    series,
    published = false,   // false = draft, true = publish immediately
    canonical_url,
  } = article;

  const payload = {
    article: {
      title,
      body_markdown,
      published,
      tags: tags.slice(0, 4),  // Dev.to max 4 tags
      ...(series && { series }),
      ...(canonical_url && { canonical_url }),
    },
  };

  const res = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Dev.to API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    platform: 'devto',
    id: data.id,
    url: data.url,
    title: data.title,
    published: data.published,
  };
}
