// Main composition v2 - PodAha 15s Promo with audio and images
import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";

// Scene timing (30fps) matched to TTS durations:
// s1: 3.0s  → Scene1: frames 0-90
// s2: 2.56s → Scene2: frames 90-167
// s3: 3.48s → Scene3: frames 167-271
// s4: 4.31s → Scene4: frames 271-400
// s5: 2.48s → Scene5: frames 400-475
// Total: ~15.83s → 476 frames → rounded to 480 (16s)

const SCENE2_AT = 90;
const SCENE3_AT = 167;
const SCENE4_AT = 271;
const SCENE5_AT = 400;
const TOTAL_FRAMES = 480;
const FADE_FRAMES = 8;

// Flash-to-black transition: must live inside a Sequence so
// useCurrentFrame() returns LOCAL frames (0…FADE_FRAMES), not global.
// Without this, extrapolateLeft:"clamp" would give opacity=0.9 for ALL
// frames BEFORE the transition point, blackening earlier scenes.
const FlashFade: React.FC = () => {
  const frame = useCurrentFrame(); // local frame inside its Sequence
  const opacity = interpolate(frame, [0, FADE_FRAMES], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: "#000", opacity, pointerEvents: "none" }} />
  );
};

export const PodAhaPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* ── Audio track ─────────────────────────────────── */}
      <Audio src={staticFile("audio/final_audio.mp3")} volume={1} />

      {/* ── Scene 1: Recording = 1 hour (frames 0–90) ─── */}
      <Sequence from={0} durationInFrames={SCENE2_AT + 6}>
        <AbsoluteFill><Scene1 /></AbsoluteFill>
      </Sequence>

      {/* ── Scene 2: Editing = 5-8h (frames 90–167) ───── */}
      <Sequence from={SCENE2_AT} durationInFrames={SCENE3_AT - SCENE2_AT + 6}>
        <AbsoluteFill><Scene2 /></AbsoluteFill>
      </Sequence>

      {/* ── Scene 3: 72% quit (frames 167–271) ─────────── */}
      <Sequence from={SCENE3_AT} durationInFrames={SCENE4_AT - SCENE3_AT + 6}>
        <AbsoluteFill><Scene3 /></AbsoluteFill>
      </Sequence>

      {/* ── Scene 4: PodAha AI solution (frames 271–400) ─ */}
      <Sequence from={SCENE4_AT} durationInFrames={SCENE5_AT - SCENE4_AT + 6}>
        <AbsoluteFill><Scene4 /></AbsoluteFill>
      </Sequence>

      {/* ── Scene 5: CTA (frames 400–480) ──────────────── */}
      <Sequence from={SCENE5_AT} durationInFrames={TOTAL_FRAMES - SCENE5_AT}>
        <AbsoluteFill><Scene5 /></AbsoluteFill>
      </Sequence>

      {/* ── Flash-to-black transitions (each Sequence = FADE_FRAMES only) ─ */}
      <Sequence from={SCENE2_AT} durationInFrames={FADE_FRAMES}>
        <FlashFade />
      </Sequence>
      <Sequence from={SCENE3_AT} durationInFrames={FADE_FRAMES}>
        <FlashFade />
      </Sequence>
      <Sequence from={SCENE4_AT} durationInFrames={FADE_FRAMES}>
        <FlashFade />
      </Sequence>
      <Sequence from={SCENE5_AT} durationInFrames={FADE_FRAMES}>
        <FlashFade />
      </Sequence>
    </AbsoluteFill>
  );
};
