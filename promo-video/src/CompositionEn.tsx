// English composition - PodAha 15s EN promo
import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Scene1En } from "./Scene1En";
import { Scene2En } from "./Scene2En";
import { Scene3En } from "./Scene3En";
import { Scene4En } from "./Scene4En";
import { Scene5En } from "./Scene5En";

// Scene timing (30fps) - matched to English TTS durations:
// s1_en: 2.89s → frames 0-87
// s2_en: 2.44s → frames 87-160
// s3_en: 4.66s → frames 160-300
// s4_en: 6.58s → frames 300-497
// s5_en: 3.87s → frames 497-614

const SCENE2_AT = 87;
const SCENE3_AT = 160;
const SCENE4_AT = 300;
const SCENE5_AT = 497;
const TOTAL_FRAMES = 614;
const FADE_FRAMES = 8;

const FlashFade: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE_FRAMES], [0.9, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: "#000", opacity, pointerEvents: "none" }} />;
};

export const PodAhaPromoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("audio/final_audio_en.mp3")} volume={1} />

      <Sequence from={0} durationInFrames={SCENE2_AT + 6}>
        <AbsoluteFill><Scene1En /></AbsoluteFill>
      </Sequence>
      <Sequence from={SCENE2_AT} durationInFrames={SCENE3_AT - SCENE2_AT + 6}>
        <AbsoluteFill><Scene2En /></AbsoluteFill>
      </Sequence>
      <Sequence from={SCENE3_AT} durationInFrames={SCENE4_AT - SCENE3_AT + 6}>
        <AbsoluteFill><Scene3En /></AbsoluteFill>
      </Sequence>
      <Sequence from={SCENE4_AT} durationInFrames={SCENE5_AT - SCENE4_AT + 6}>
        <AbsoluteFill><Scene4En /></AbsoluteFill>
      </Sequence>
      <Sequence from={SCENE5_AT} durationInFrames={TOTAL_FRAMES - SCENE5_AT}>
        <AbsoluteFill><Scene5En /></AbsoluteFill>
      </Sequence>

      <Sequence from={SCENE2_AT} durationInFrames={FADE_FRAMES}><FlashFade /></Sequence>
      <Sequence from={SCENE3_AT} durationInFrames={FADE_FRAMES}><FlashFade /></Sequence>
      <Sequence from={SCENE4_AT} durationInFrames={FADE_FRAMES}><FlashFade /></Sequence>
      <Sequence from={SCENE5_AT} durationInFrames={FADE_FRAMES}><FlashFade /></Sequence>
    </AbsoluteFill>
  );
};
