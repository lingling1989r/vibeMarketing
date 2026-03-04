// Hashnode Publisher
// API: GraphQL, https://api.hashnode.com
// Auth: Personal Access Token (PAT)
// Env: HASHNODE_TOKEN, HASHNODE_PUBLICATION_ID
// Get PAT: https://hashnode.com/settings/developer
// Get publication ID: dashboard URL contains your pub ID

export async function publishToHashnode(article, options = {}) {
  const token  = process.env.HASHNODE_TOKEN;
  const pubId  = process.env.HASHNODE_PUBLICATION_ID;
  if (!token)  throw new Error('HASHNODE_TOKEN not set');
  if (!pubId)  throw new Error('HASHNODE_PUBLICATION_ID not set');

  const {
    title,
    contentMarkdown,
    tags = [],          // array of { name, slug }
    coverImageURL,
    publishedAt,        // ISO string, null = publish now
    originalArticleURL, // canonical URL
    isDraft = false,
  } = article;

  const mutation = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          url
          title
          publishedAt
        }
      }
    }
  `;

  const variables = {
    input: {
      title,
      contentMarkdown,
      publicationId: pubId,
      tags: tags.slice(0, 5),
      ...(coverImageURL && { coverImageOptions: { coverImageURL } }),
      ...(publishedAt && { publishedAt }),
      ...(originalArticleURL && { originalArticleURL }),
      isDraft,
    },
  };

  const res = await fetch('https://gql.hashnode.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Hashnode API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  if (data.errors) throw new Error(`Hashnode GraphQL error: ${JSON.stringify(data.errors)}`);

  const post = data.data.publishPost.post;
  return {
    platform: 'hashnode',
    id: post.id,
    url: post.url,
    title: post.title,
    publishedAt: post.publishedAt,
  };
}
