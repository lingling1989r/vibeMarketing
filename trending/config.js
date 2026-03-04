// ─────────────────────────────────────────────
// Relevance keywords for scoring hot topics
// against PodAha's target audience and product
// ─────────────────────────────────────────────

export const KEYWORDS = {
  // Direct match → score +5
  core: [
    '播客', 'podcast', 'podcasting', '播客主', '播客制作', '播客剪辑',
    'podaha', 'pod aha', '音频内容', 'audio content',
  ],
  // AI tools → score +4
  ai_tools: [
    'AI剪辑', 'AI工具', 'AI配音', 'AI降噪', 'AI转录', 'whisper',
    'ai podcast', 'podcast ai', 'audio ai', 'speech to text',
    '智能剪辑', '自动剪辑', '语音识别',
  ],
  // Creator economy → score +3
  creator: [
    '内容创业', '自媒体', '创作者经济', '知识付费', '内容变现',
    '副业', '睡后收入', '被动收入', '私域流量',
    'creator economy', 'content creator', 'indie creator',
    'solopreneur', 'bootstrapped', 'side hustle', 'passive income',
  ],
  // Indie dev → score +3
  indie_dev: [
    '独立开发', '独立开发者', '独立产品', 'indiehacker', 'indie hacker',
    'side project', 'saas', 'micro saas', 'build in public',
  ],
  // Broad tech & AI trends → score +2
  tech_trend: [
    'AI', '人工智能', 'ChatGPT', 'Claude', 'GPT', 'LLM', '大模型',
    '音频', 'SaaS', '工具效率', '生产力工具',
    'productivity', 'workflow', 'automation', 'open source',
  ],
  // Business & growth → score +1
  business: [
    '商业模式', '变现', '流量', '涨粉', '增长', '出海',
    'monetization', 'growth', 'marketing', 'audience',
  ],
};

// Platforms to scrape
export const PLATFORMS = {
  baidu:      { name: '百度热搜',    lang: 'zh', enabled: true },
  zhihu:      { name: '知乎热榜',    lang: 'zh', enabled: true },
  juejin:     { name: '稀土掘金',    lang: 'zh', enabled: true },
  hackernews: { name: 'Hacker News', lang: 'en', enabled: true },
  reddit:     { name: 'Reddit',      lang: 'en', enabled: true },
  ph:         { name: 'Product Hunt',lang: 'en', enabled: true },
};

// Podcast-specific reference sites for research
export const RESEARCH_SITES = {
  zh: [
    { name: '知乎-播客话题', url: 'https://www.zhihu.com/topic/19835043/hot' },
    { name: '掘金-音频/播客', url: 'https://juejin.cn/search?query=播客' },
    { name: '小宇宙播客榜', url: 'https://www.xiaoyuzhoufm.com/explore' },
  ],
  en: [
    { name: 'Transistor Blog',    url: 'https://transistor.fm/blog/' },
    { name: 'Buzzsprout Blog',    url: 'https://www.buzzsprout.com/blog' },
    { name: 'Podcast Insights',   url: 'https://www.podcastinsights.com/' },
    { name: 'Castos Blog',        url: 'https://castos.com/blog/' },
    { name: 'Podchaser Trending', url: 'https://www.podchaser.com/trends' },
    { name: 'Podnews',            url: 'https://podnews.net/' },
    { name: 'IndieHackers',       url: 'https://www.indiehackers.com/products?revenueVerified=true' },
    { name: 'HN Podcast Search',  url: 'https://hn.algolia.com/?q=podcast' },
  ],
};
