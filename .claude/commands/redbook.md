---
description: 生成小红书图文卡片（封面 + 正文图）。先 AI 撰写内容，再渲染为 1080×1440 PNG，支持 8 种主题。用法：/redbook "话题或素材" [--theme default|playful-geometric|neo-brutalism|botanical|professional|retro|terminal|sketch] [--mode separator|auto-split|auto-fit|dynamic]
argument-hint: '"话题" [--theme playful-geometric] [--mode auto-split]'
---

请帮我生成一套小红书图文笔记卡片。

用户输入：$ARGUMENTS

**工具路径：**
```
REDBOOK_DIR=/Users/kin/marketing_workspace/podaha/content/tools/opencode-skills/auto-redbook
```

---

## 第一步：解析参数

从 `$ARGUMENTS` 提取：
- **话题/素材**：第一个参数（不带 `--` 前缀的字符串）
- **--theme**：主题（默认 `neo-brutalism`）
- **--mode**：分页模式（默认 `separator`）

如果没有话题，询问用户：要写什么内容？

---

## 第二步：撰写小红书笔记

根据话题创作符合小红书风格的内容：

**标题（≤20字）**：吸引眼球，用数字/悬念/感叹词

**正文要求**：
- 短句子，短段落，每段 1-2 句
- 适量 Emoji（每段 1-2 个）
- 结尾带 5-10 个 SEO 标签（`#播客 #AI工具` 格式）

---

## 第三步：生成渲染用 Markdown 文件

**重要：这个 Markdown 专门为渲染卡片设计，和笔记正文不同**

格式：

```markdown
---
emoji: "🎙️"
title: "大标题（≤15字）"
subtitle: "副标题（≤15字）"
---

# 卡片1标题

卡片1内容（约200字）

---

# 卡片2标题

卡片2内容

---
```

将文件保存到：`/tmp/redbook-$(date +%Y%m%d-%H%M%S).md`

用 Bash 工具写入：
```bash
cat > /tmp/redbook-content.md << 'MDEOF'
（Markdown内容）
MDEOF
```

---

## 第四步：渲染图片卡片

用 Bash 工具运行：

```bash
THEME="neo-brutalism"   # 替换为用户指定的 --theme 值（默认 neo-brutalism）
MODE="separator"        # 替换为用户指定的 --mode 值（默认 separator）
OUT_DIR="/tmp/redbook-out-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT_DIR"

cd /Users/kin/marketing_workspace/podaha/content/tools/opencode-skills/auto-redbook && \
python3 scripts/render_xhs.py /tmp/redbook-content.md -t "$THEME" -m "$MODE" -o "$OUT_DIR"
```

---

## 第五步：展示结果

告知用户：
1. 生成了哪些文件（cover.png + card_N.png）
2. 输出路径
3. 如需发布，配置 `.env` 中的 `XHS_COOKIE` 后运行：
   ```bash
   cd /Users/kin/marketing_workspace/podaha/content/tools/opencode-skills/auto-redbook
   python3 scripts/publish_xhs.py --title "标题" --desc "正文" --images cover.png card_1.png card_2.png
   ```
4. 如需换主题重新渲染，告知命令

**可用主题速查：**

| 主题 | 风格 |
|------|------|
| `default` | 简约浅灰 |
| `playful-geometric` | 活泼几何（Memphis）|
| `neo-brutalism` | 新粗野主义（高饱和+粗边框）|
| `botanical` | 植物园自然 |
| `professional` | 专业商务 |
| `retro` | 复古怀旧 |
| `terminal` | 终端命令行 |
| `sketch` | 手绘素描 |

**分页模式速查：**

| 模式 | 适合 |
|------|------|
| `separator` | 内容用 `---` 手动分割，精确控制每张卡 |
| `auto-split` | 长文自动按高度切分（最常用）|
| `auto-fit` | 固定尺寸，文字缩放适配 |
| `dynamic` | 每张卡片高度随内容变化 |
