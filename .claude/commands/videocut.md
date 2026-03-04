---
description: AI 口播视频剪辑：自动转录+识别口误+网页审核+FFmpeg剪辑。需要火山引擎 API Key。用法：/videocut 视频路径.mp4 | /videocut --check（环境检查）
argument-hint: "<video.mp4> | --check"
---

请帮我处理口播视频。

用户输入：$ARGUMENTS

**脚本目录：**
```
SKILL_DIR=/Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/剪口播
```

---

## 如果参数是 `--check`：验证环境

用 Bash 工具运行：

```bash
echo "=== videocut 环境检查 ==="
echo "Node.js: $(node -v)"
echo "FFmpeg:  $(ffmpeg -version 2>&1 | head -1 | cut -d' ' -f3)"
echo "curl:    $(curl --version 2>&1 | head -1 | cut -d' ' -f2)"

ENV_FILE="/Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/.env"
if [ -f "$ENV_FILE" ]; then
  KEY=$(grep VOLCENGINE_API_KEY "$ENV_FILE" | cut -d'=' -f2)
  [ -n "$KEY" ] && echo "VOLCENGINE_API_KEY: ✅ 已配置" || echo "VOLCENGINE_API_KEY: ❌ .env 存在但 Key 为空"
else
  echo "VOLCENGINE_API_KEY: ❌ .env 不存在"
  echo "  → 创建方式: cp /Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/.env.example /Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/.env"
  echo "  → 然后填入: VOLCENGINE_API_KEY=你的key"
  echo "  → 获取地址: https://console.volcengine.com/speech/new/experience/asr"
fi
```

根据检查结果告知用户哪些条件满足，哪些需要配置。

---

## 如果参数是视频路径：执行完整剪辑流程

### 步骤 0：确认视频存在

```bash
VIDEO_PATH="$ARGUMENTS"  # 替换为实际路径
ls -lh "$VIDEO_PATH" 2>&1
```

如果找不到文件，让用户提供完整路径。

### 步骤 1：创建输出目录

```bash
VIDEO_PATH="<用户提供的路径>"
VIDEO_NAME=$(basename "$VIDEO_PATH" .mp4)
DATE=$(date +%Y-%m-%d)
BASE_DIR="output/${DATE}_${VIDEO_NAME}/剪口播"
mkdir -p "$BASE_DIR/1_转录" "$BASE_DIR/2_分析" "$BASE_DIR/3_审核"
echo "输出目录: $BASE_DIR"
```

### 步骤 2：提取音频

```bash
cd "$BASE_DIR/1_转录"
ffmpeg -i "file:$VIDEO_PATH" -vn -acodec libmp3lame -y audio.mp3 2>&1 | tail -5
ls -lh audio.mp3
```

### 步骤 3：上传获取公网 URL

```bash
UPLOAD_RESULT=$(curl -s -F "files[]=@audio.mp3" https://uguu.se/upload)
echo "$UPLOAD_RESULT"
# 提取 URL: {"success":true,"files":[{"url":"https://h.uguu.se/xxx.mp3"}]}
```

从结果中提取 URL，继续下一步。

### 步骤 4：火山引擎转录

```bash
SKILL_DIR="/Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/剪口播"
"$SKILL_DIR/scripts/volcengine_transcribe.sh" "<公网音频URL>"
# 输出: volcengine_result.json（等待 1-5 分钟）
```

检查 `.env` 是否存在，否则提示用户先运行 `/videocut --check`。

### 步骤 5：生成字幕 & 分析口误

```bash
SKILL_DIR="/Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/剪口播"

# 生成字幕
cd ../
node "$SKILL_DIR/scripts/generate_subtitles.js" 1_转录/volcengine_result.json

# 生成易读格式
cd 2_分析
node -e "
const data = require('../1_转录/subtitles_words.json');
let output = [];
data.forEach((w, i) => {
  if (w.isGap) {
    const dur = (w.end - w.start).toFixed(2);
    if (dur >= 0.5) output.push(i + '|[静' + dur + 's]|' + w.start.toFixed(2) + '-' + w.end.toFixed(2));
  } else {
    output.push(i + '|' + w.text + '|' + w.start.toFixed(2) + '-' + w.end.toFixed(2));
  }
});
require('fs').writeFileSync('readable.txt', output.join('\n'));
console.log('readable.txt 生成完成，共', output.length, '行');
"

# 标记静音段
node -e "
const words = require('../1_转录/subtitles_words.json');
const selected = [];
words.forEach((w, i) => {
  if (w.isGap && (w.end - w.start) >= 0.5) selected.push(i);
});
require('fs').writeFileSync('auto_selected.json', JSON.stringify(selected, null, 2));
console.log('静音段数量:', selected.length);
"
```

然后**读取 `readable.txt` 进行 AI 分析**，检测口误/重复句，将结果追加到 `auto_selected.json`。

分析规则（按优先级）：
1. 重复句：相邻句子开头 ≥5 字相同 → 删较短的整句
2. 残句：话说一半 + 静音 → 删整句
3. 句内重复：A + 中间内容 + A → 删前面
4. 卡顿词：那个那个/就是就是 → 删前面
5. 语气词：嗯/啊 → 标记（不自动删）

**重要：readable.txt 每行格式是 `idx|内容|时间`，用 idx 值，不用行号！**

### 步骤 6：生成审核网页 & 启动服务器

```bash
SKILL_DIR="/Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/剪口播"
cd ../3_审核

# 生成审核页面
node "$SKILL_DIR/scripts/generate_review.js" \
  ../1_转录/subtitles_words.json \
  ../2_分析/auto_selected.json \
  ../1_转录/audio.mp3

# 启动审核服务器
node "$SKILL_DIR/scripts/review_server.js" 8899 "$VIDEO_PATH"
# 打开浏览器访问 http://localhost:8899
```

告知用户：
- 打开 http://localhost:8899 进行审核
- 在网页中播放片段、勾选/取消删除项
- 确认后点击「执行剪辑」完成剪辑
- 剪辑后的视频保存在 `output/` 目录

---

## 依赖配置说明

| 依赖 | 状态 | 说明 |
|------|------|------|
| Node.js | 系统已安装 ✅ | v25.7.0 |
| FFmpeg | 系统已安装 ✅ | v8.0.1 |
| curl | 系统已安装 ✅ | v8.7.1 |
| VOLCENGINE_API_KEY | 需手动配置 ❌ | 见下方 |

**获取火山引擎 API Key：**
1. 访问 https://console.volcengine.com/speech/new/experience/asr
2. 注册/登录 → 开通语音识别服务 → 创建 API Key
3. 写入配置文件：
   ```bash
   echo "VOLCENGINE_API_KEY=你的key" > /Users/kin/marketing_workspace/podaha/content/tools/videocut-skills/.env
   ```
