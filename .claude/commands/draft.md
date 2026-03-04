---
description: 用 AI 起草一篇平台适配的内容草稿，保存到 content/library/。用法：/draft "话题" --channel 平台 --lang zh|en
argument-hint: '"话题或标题" [--channel wechat|zhihu|twitter|devto|medium|reddit|baijiahao|csdn] [--lang zh|en]'
---

为 PodAha 生成一篇平台适配的内容草稿。

用户的请求：$ARGUMENTS

**步骤：**

1. 解析参数，确定话题、频道（channel）、语言（lang）
   - 如果未指定 channel，询问用户要发到哪个平台
   - 如果未指定 lang，根据 channel 推断（wechat/zhihu/baijiahao/csdn → zh；twitter/devto/medium/reddit/hashnode → en）

2. 查看当前已有的内容库：
```
!`ls /Users/kin/marketing_workspace/podaha/content/library/ 2>/dev/null || echo "（内容库为空）"`
```

3. 基于以下 PodAha 产品背景起草内容：
   - 核心价值：播客制作从 8 小时→1 小时
   - 关键数据：72% 的播客主在第 10 集后放弃；55% 的人单期制作超过 5 小时
   - 功能：噪音消除、自动转录、Show Notes、社交媒体短视频剪辑
   - 免费开始，无需信用卡；Product Hunt 2026-03-18 上线
   - 网址：podaha.com

4. 根据不同平台风格生成草稿：
   - **微信公众号**：故事化开头，情感共鸣，1000-1500字，适合收藏转发
   - **知乎专栏**：问题驱动，专业深度，结构清晰，引用数据
   - **Twitter/X**：简洁有力，钩子开头，可以是 thread 格式（5-7条）
   - **Dev.to / Medium**：技术或创业视角，实用干货，代码/流程图辅助
   - **Reddit**：社区友好，真实分享，避免硬广，鼓励讨论
   - **百家号 / CSDN**：标题吸引眼球，内容实用，适合搜索引擎收录

5. 草稿格式要求：
   - 顶部 frontmatter（title, channel, lang, tags, description, date）
   - 正文 Markdown 格式
   - 底部附【编辑提示】：需要补充的具体数据、图片建议、发布时间建议

6. 将草稿内容直接输出给用户预览，并告知运行以下命令保存：
   `node content/generator.js "[话题]" --channel [channel] --lang [lang]`
