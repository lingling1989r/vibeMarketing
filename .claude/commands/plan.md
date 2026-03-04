---
description: 查看 PodAha 内容日历。参数：--all 完整日历 | --channel=twitter | --status=planned
argument-hint: "[--all] [--channel=twitter|wechat|zhihu|devto...] [--status=planned|ready|published]"
---

请用 Bash 工具运行以下命令，然后分析输出：

```bash
cd /Users/kin/marketing_workspace/podaha/planning && node weekly.js $ARGUMENTS
```

分析完毕后，用中文：
1. 总结今天最紧迫的 1-3 个任务，说明为什么紧迫
2. 对所有 `planned` 状态的任务，给出具体的内容方向建议（不要只是复述话题，要给出角度和开头句）
3. 点出有 `notes` 提示的任务（如 "Fill in real [X] numbers"），提醒用户补充具体数据
4. 如果参数包含 `--all`，额外输出：从今天到 2026-03-18 的整体节奏，哪些日期最关键，当前状态是否有风险
