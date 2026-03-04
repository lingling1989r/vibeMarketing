---
description: 用 AI 起草平台适配内容草稿并保存到 content/library/。用法：/draft "话题" --channel 平台 --lang zh|en
argument-hint: '"话题" [--channel wechat|zhihu|twitter|devto|medium|reddit|baijiahao|csdn] [--lang zh|en]'
---

请帮我为 PodAha 生成一篇内容草稿。

用户输入：$ARGUMENTS

**步骤 1：解析参数**

从 `$ARGUMENTS` 中提取：
- `话题`：第一个不以 `--` 开头的参数（整个引号内的字符串）
- `--channel`：目标平台，默认 `wechat`
- `--lang`：语言，默认 `zh`；英文平台（twitter/devto/medium/reddit/hashnode）自动改为 `en`

如果 `$ARGUMENTS` 为空，先问用户：话题是什么？发哪个平台？

**步骤 2：运行生成器**

用 Bash 工具运行：

```bash
cd /Users/kin/marketing_workspace/podaha/content && node generator.js $ARGUMENTS
```

注意：参数格式须为 `--channel=平台 --lang=语言`（带等号），例如：
```bash
node generator.js "你的话题" --channel=wechat --lang=zh
```

**步骤 3：展示结果**

- 将生成的内容完整显示给用户
- 告知保存路径（`content/library/语言/日期-平台-slug.md`）
- 给出 2-3 条具体的编辑建议：哪里可以加强？数据是否需要更新？
- 提示下一步：`/distribute content/library/... ` 来分发这篇文章

**平台风格速查：**
- wechat：故事体，2000-3000字，情感共鸣
- zhihu：专业问答，1000-2000字，数据+案例
- twitter：7-tweet thread，每条≤280字，数据驱动
- devto：技术博客，Markdown，TL;DR 开头
- medium：叙事风格，1000-1500字
- reddit：社区风格，300-500字，非广告
- baijiahao：大众向，简洁，易搜索
- csdn：技术向，含工具对比
