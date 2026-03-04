---
description: 格式化文章或一键发布到多平台（EN+CN 共 11 个）。用法：/distribute 文章路径 [--publish] [--lang=en|zh] [--platform=devto,csdn] [--draft]
argument-hint: "<article.md> [--publish] [--lang=en|zh] [--platform=devto,hashnode,csdn...] [--draft]"
---

请帮我分发 PodAha 文章到各平台。

用户命令：$ARGUMENTS

**步骤 1：检查文章路径**

如果 `$ARGUMENTS` 里没有 `.md` 文件路径，用 Bash 列出可用文章：

```bash
find /Users/kin/marketing_workspace/podaha/distributor/articles \
  /Users/kin/marketing_workspace/podaha/content/library \
  -name "*.md" 2>/dev/null | head -20
```

**步骤 2：判断运行模式**

- 如果参数包含 `--publish`：执行**自动发布**
- 否则：执行**格式化输出**（生成 dist/ 各平台文件）

**步骤 3a：格式化模式（无 --publish）**

用 Bash 运行：

```bash
cd /Users/kin/marketing_workspace/podaha/distributor && node index.js $ARGUMENTS
```

然后告知用户 `dist/文章名/` 目录下生成了哪些文件，以及如何使用每个文件。

**步骤 3b：发布模式（有 --publish）**

先检查环境变量配置情况：

```bash
echo "=== Token 配置状态 ===" && \
echo "DEVTO_API_KEY: ${DEVTO_API_KEY:+✅}${DEVTO_API_KEY:-❌ 未配置}" && \
echo "MEDIUM_TOKEN: ${MEDIUM_TOKEN:+✅}${MEDIUM_TOKEN:-❌ 未配置}" && \
echo "TWITTER_API_KEY: ${TWITTER_API_KEY:+✅}${TWITTER_API_KEY:-❌ 未配置}" && \
echo "REDDIT_CLIENT_ID: ${REDDIT_CLIENT_ID:+✅}${REDDIT_CLIENT_ID:-❌ 未配置}" && \
echo "HASHNODE_TOKEN: ${HASHNODE_TOKEN:+✅}${HASHNODE_TOKEN:-❌ 未配置}" && \
echo "BAIJIAHAO_APP_ID: ${BAIJIAHAO_APP_ID:+✅}${BAIJIAHAO_APP_ID:-❌ 未配置}" && \
echo "CSDN_COOKIE: ${CSDN_COOKIE:+✅}${CSDN_COOKIE:-❌ 未配置}" && \
echo "TOUTIAO_COOKIE: ${TOUTIAO_COOKIE:+✅}${TOUTIAO_COOKIE:-❌ 未配置}" && \
echo "SOHU_COOKIE: ${SOHU_COOKIE:+✅}${SOHU_COOKIE:-❌ 未配置}" && \
echo "ZHIHU_COOKIE: ${ZHIHU_COOKIE:+✅}${ZHIHU_COOKIE:-❌ 未配置}" && \
echo "JIANSHU_COOKIE: ${JIANSHU_COOKIE:+✅}${JIANSHU_COOKIE:-❌ 未配置}"
```

再执行发布：

```bash
cd /Users/kin/marketing_workspace/podaha/distributor && node index.js $ARGUMENTS
```

**步骤 4：结果汇总**

根据输出：
- ✅ 成功的平台：列出链接
- ⏭️ 跳过的平台：给出对应的 Token/Cookie 获取地址
- ❌ 失败的：分析原因，给出修复建议

**Token 获取速查：**

| 平台 | 获取地址 |
|------|----------|
| Dev.to | https://dev.to/settings/extensions |
| Medium | https://medium.com/me/settings → Integration tokens |
| Twitter/X | https://developer.twitter.com/ |
| Reddit | https://www.reddit.com/prefs/apps → script 类型 |
| Hashnode | https://hashnode.com/settings/developer |
| 百家号 | https://baijiahao.baidu.com/builder/author/openauth/ |
| CSDN/头条/搜狐/知乎/简书 | 登录对应平台 → F12 → Network → 复制任意请求的 Cookie |

完整模板：`distributor/.env.example`
