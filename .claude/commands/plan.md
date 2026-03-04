---
description: 查看 PodAha 内容日历和本周运营任务。可用参数：--all（完整日历）、--channel=twitter、--status=planned
argument-hint: "[--all] [--channel=twitter|wechat|zhihu|devto...] [--status=planned|ready|published]"
---

运行内容日历并分析当前运营状态：

当前日历输出：
```
!`cd /Users/kin/marketing_workspace/podaha/planning && node weekly.js $ARGUMENTS 2>&1`
```

请根据上面的输出：
1. 总结今天（或本周）最紧迫的任务
2. 对于状态是 `planned` 的任务，建议具体的行动步骤（内容方向、素材需求）
3. 如果有 `notes` 提示（如"Fill in real [X] numbers"），主动提醒用户需要补充什么信息
4. 用中文回答，简洁清晰

如果用户传入了 `--all`，额外给出从今天到发布日（2026-03-18）的整体节奏建议。
