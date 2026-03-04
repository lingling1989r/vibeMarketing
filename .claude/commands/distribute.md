---
description: 格式化文章或一键发布到多平台。用法：/distribute 文章路径 [--publish] [--lang=zh|en] [--platform=devto,hashnode] [--draft]
argument-hint: "<article.md> [--publish] [--lang=en|zh] [--platform=devto,hashnode,csdn...] [--draft]"
---

执行 PodAha 多平台内容分发。

用户命令：$ARGUMENTS

**步骤 1：解析参数**

- 如果没有传文章路径，列出可用文章：
```
!`find /Users/kin/marketing_workspace/podaha -name "*.md" \
  -not -path "*/node_modules/*" \
  -not -path "*/.claude/*" \
  -not -name "README*" \
  -not -name "MEMORY*" \
  | head -20 2>&1`
```

**步骤 2：检查环境变量配置**

```
!`cd /Users/kin/marketing_workspace/podaha && \
  echo "=== 英文平台 ===" && \
  echo "DEVTO_API_KEY: $([ -n "$DEVTO_API_KEY" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "MEDIUM_TOKEN: $([ -n "$MEDIUM_TOKEN" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "TWITTER_API_KEY: $([ -n "$TWITTER_API_KEY" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "REDDIT_CLIENT_ID: $([ -n "$REDDIT_CLIENT_ID" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "HASHNODE_TOKEN: $([ -n "$HASHNODE_TOKEN" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "=== 中文平台 ===" && \
  echo "BAIJIAHAO_APP_ID: $([ -n "$BAIJIAHAO_APP_ID" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "CSDN_COOKIE: $([ -n "$CSDN_COOKIE" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "TOUTIAO_COOKIE: $([ -n "$TOUTIAO_COOKIE" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "SOHU_COOKIE: $([ -n "$SOHU_COOKIE" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "ZHIHU_COOKIE: $([ -n "$ZHIHU_COOKIE" ] && echo '✅ 已配置' || echo '❌ 未配置')" && \
  echo "JIANSHU_COOKIE: $([ -n "$JIANSHU_COOKIE" ] && echo '✅ 已配置' || echo '❌ 未配置')"`
```

**步骤 3：执行分发**

如果用户传了 `--publish`，运行发布命令：
```
!`cd /Users/kin/marketing_workspace/podaha/distributor && node index.js $ARGUMENTS 2>&1`
```

如果没有 `--publish`（仅格式化），运行格式化：
```
!`cd /Users/kin/marketing_workspace/podaha/distributor && node index.js $ARGUMENTS 2>&1`
```

**步骤 4：结果分析**

根据命令输出：
1. 告知哪些平台发布成功（附链接）
2. 哪些平台因缺少 Token/Cookie 被跳过，给出对应的配置指引
3. 如果有错误，分析原因并给出修复建议
4. 如果是草稿模式，提醒用户去各平台手动发布

**配置指引（按需展示）：**
- Dev.to: `https://dev.to/settings/extensions` → DEV Community API Keys
- Medium: `https://medium.com/me/settings` → Integration tokens
- Reddit: `https://www.reddit.com/prefs/apps` → 创建 script 应用
- Hashnode: `https://hashnode.com/settings/developer`
- 百家号: `https://baijiahao.baidu.com/builder/author/openauth/`
- CSDN/头条/搜狐/知乎/简书: 登录对应平台 → F12 → Network → 复制 Cookie

完整配置模板在 `distributor/.env.example`
