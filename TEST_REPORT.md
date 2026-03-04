# PodAha Marketing Tools — 测试记录
_测试日期：2026-03-04_

---

## 模块总览

| 模块 | 脚本 | Skill | 状态 |
|------|------|-------|------|
| 运营规划 | `planning/weekly.js` | `/plan` | ✅ |
| 内容生产 | `content/generator.js` | `/draft` | ✅ |
| 渠道分发 | `distributor/index.js` | `/distribute` | ✅ |
| 小红书卡片 | `content/tools/.../render_xhs.py` | `/redbook` | ✅ |
| 口播剪辑 | `content/tools/videocut-skills/` | `/videocut` | ✅ (待API Key) |

---

## 一、`/plan` — planning/weekly.js

| 测试用例 | 命令 | 结果 |
|----------|------|------|
| 无参数（本周任务） | `node weekly.js` | ✅ 彩色状态标记正常 |
| 完整日历 | `node weekly.js --all` | ✅ 输出 D-14 到 D-0 |
| 按渠道过滤 | `node weekly.js --channel=twitter` | ✅ 正确过滤 |
| 按状态过滤 | `node weekly.js --status=planned` | ✅ 5 个 planned 任务 |

**结论：✅ 全部通过**

---

## 二、`/draft` — content/generator.js

### Bug 修复

原参数解析只支持 `--flag=value`，不支持 `--flag value`，修复后两种写法均可用。

| 测试用例 | 结果 |
|----------|------|
| `--channel=wechat --lang=zh` | ✅ 2000+ 字故事体 |
| `--channel twitter --lang en`（空格语法修复后） | ✅ 7-tweet thread |
| `--channel=zhihu --lang=zh` | ✅ 专业问答体 |
| 无 API Key | ✅ 提示错误后退出 |
| 无话题参数 | ✅ 提示 Usage |
| 文件保存路径 | ✅ `YYYY-MM-DD-channel-slug.md` |

**结论：✅ 全部通过（修复 1 个 bug）**

---

## 三、`/distribute` — distributor/index.js

| 测试用例 | 结果 |
|----------|------|
| 格式化模式 | ✅ 生成 wechat/baijiahao/sohu/zhihu/juejin 5 份文件 |
| EN 发布（无 Token） | ✅ 5 个平台全部 ⏭️ + 列出缺少变量名 |
| CN 发布（无 Cookie） | ✅ 6 个平台全部 ⏭️ + 列出缺少变量名 |
| `--platform=devto` 单平台 | ✅ 只处理 devto |
| `--draft` 草稿模式 | ✅ 显示 "草稿" 提示 |
| `--platform=unknown` 未知平台 | ✅ 报错 + 列出支持平台 |
| 无文章路径 | ✅ 提示 Usage |
| 文件不存在 | ✅ 提示 File not found |
| 11 个发布器语法检查 | ✅ 全部 `node --check` 通过 |

**结论：✅ 全部通过**

---

## 四、`/redbook` — auto-redbook (zrt-ai-lab/opencode-skills)

**安装路径：** `content/tools/opencode-skills/auto-redbook/`

### 依赖安装

| 依赖 | 安装方式 | 状态 |
|------|----------|------|
| Node.js marked/yaml/playwright | `npm install` | ✅ |
| Python markdown/pyyaml/playwright | 系统已安装 | ✅ |
| Playwright Chromium (Node) | `npx playwright install chromium` | ✅ |
| Playwright Chromium (Python) | `python3 -m playwright install chromium` | ✅ |

### 功能测试

| 测试用例 | 命令 | 结果 |
|----------|------|------|
| Python 渲染 + playful-geometric 主题 | `python3 render_xhs.py example.md -t playful-geometric -m separator` | ✅ 封面 + 4 张卡片 |
| Node.js 渲染 + retro 主题 | `node render_xhs.js example.md -t retro -m separator` | ✅ 封面 + 4 张卡片 |
| PodAha 真实内容 + neo-brutalism | `python3 render_xhs.py podaha-example.md -t neo-brutalism -m separator` | ✅ 封面 + 5 张卡片 |
| auto-split 自动分页模式 | （未测，逻辑相同，Python 脚本支持）| ⚪ 未测 |

**输出规格：** 1080×1440px PNG，3:4 比例，符合小红书标准

**结论：✅ 核心渲染功能全部通过，发布功能需配置 `XHS_COOKIE`**

---

## 五、`/videocut` — videocut-skills (Ceeon/videocut-skills)

**安装路径：** `content/tools/videocut-skills/`

### 依赖检查

| 依赖 | 状态 | 说明 |
|------|------|------|
| Node.js v25.7.0 | ✅ | 系统已安装 |
| FFmpeg v8.0.1 | ✅ | 系统已安装 |
| curl v8.7.1 | ✅ | 系统自带 |
| VOLCENGINE_API_KEY | ❌ 待配置 | 需注册火山引擎 |

### 脚本语法检查

| 文件 | 结果 |
|------|------|
| `剪口播/scripts/generate_subtitles.js` | ✅ |
| `剪口播/scripts/generate_review.js` | ✅ |
| `剪口播/scripts/review_server.js` | ✅ |
| `字幕/scripts/subtitle_server.js` | ✅ |
| `剪口播/scripts/volcengine_transcribe.sh` | ✅ (shell，逻辑已审查) |

### 路径修复

原 SKILL.md 中 `SKILL_DIR` 硬编码为 `/Users/chengfeng/Desktop/AIos/...`，
新 `/videocut` 命令文件中已更新为本机正确路径：
`/Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/剪口播`

### 限制

完整流程（转录→剪辑）需要 VOLCENGINE_API_KEY，当前未配置，无法端到端测试。
配置方式：
```bash
echo "VOLCENGINE_API_KEY=你的key" > content/tools/videocut-skills/.env
# 获取: https://console.volcengine.com/speech/new/experience/asr
```

**结论：✅ 环境准备完毕，脚本语法全通，等待 API Key 后可完整使用**

---

## Skill 文件汇总

| Skill | 文件 | 状态 |
|-------|------|------|
| `/plan` | `.claude/commands/plan.md` | ✅ |
| `/draft` | `.claude/commands/draft.md` | ✅ |
| `/distribute` | `.claude/commands/distribute.md` | ✅ |
| `/redbook` | `.claude/commands/redbook.md` | ✅ |
| `/videocut` | `.claude/commands/videocut.md` | ✅ |

---

## 总结

| 项目 | 状态 | 备注 |
|------|------|------|
| `/plan` (weekly.js) | ✅ | 4 种参数全通 |
| `/draft` (generator.js) | ✅ 修复1 bug | arg 解析支持空格/等号两种写法 |
| `/distribute` (11 publishers) | ✅ | 8 种调用路径 + 语法全通 |
| `/redbook` (auto-redbook) | ✅ | Python+Node 双引擎，3 种主题实测 |
| `/videocut` (videocut-skills) | ✅ 待 API Key | 脚本语法全通，路径已修正 |
