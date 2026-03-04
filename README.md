# vibeMarketing — PodAha Promo

AI-generated 16s promotional video for [podaha.com](https://podaha.com), built with **Remotion**.

## Project: `podaha/promo-video`

A 16-second vertical (1080×1920) promo video covering:
- User pain points: podcast editing takes 5-8 hours per episode
- Industry stats: 72% of podcasters quit, average show stops after 10 episodes
- Solution: PodAha AI — denoise, transcribe, clip, publish in 1 hour

### Stack
- **Remotion** — React-based programmatic video
- **macOS TTS** (Tingting voice) — Chinese voiceover
- **ffmpeg** — audio mixing & synthesis
- **Unsplash** — background images

### Output
`promo-video/out/podaha-promo-v2.mp4` — 1080×1920, H.264, 16s, with audio

### Run
```bash
cd promo-video
npm install
npm run start      # Remotion Studio preview
npm run render     # Render vertical MP4
npm run render:wide  # Render 16:9 MP4
```

### Re-generate audio (macOS)
```bash
cd promo-video/public/audio
say -v Tingting --rate=170 "录制一期播客，只需一个小时。" -o s1.aiff
ffmpeg -y -i s1.aiff -ar 44100 -ac 1 -ab 128k s1.mp3
# ... repeat for s2-s5, then run mix commands in README
```
