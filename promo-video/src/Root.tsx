import React from "react";
import { Composition } from "remotion";
import { PodAhaPromo } from "./Composition";
import { PodAhaPromoEn } from "./CompositionEn";
import {
  CardTime, CardStats, CardWorkflow, CardLaunch, CardFeatures,
} from "./Cards";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Chinese promo video (1080×1920 vertical) ── */}
      <Composition
        id="PodAhaPromo"
        component={PodAhaPromo}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ── English promo video (1080×1920 vertical) ── */}
      <Composition
        id="PodAhaPromoEn"
        component={PodAhaPromoEn}
        durationInFrames={614}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ── Twitter/X image cards (1200×675) ── */}
      <Composition
        id="CardTime"
        component={CardTime}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={675}
        defaultProps={{}}
      />
      <Composition
        id="CardStats"
        component={CardStats}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={675}
        defaultProps={{}}
      />
      <Composition
        id="CardWorkflow"
        component={CardWorkflow}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={675}
        defaultProps={{}}
      />
      <Composition
        id="CardLaunch"
        component={CardLaunch}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={675}
        defaultProps={{}}
      />
      <Composition
        id="CardFeatures"
        component={CardFeatures}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={675}
        defaultProps={{}}
      />
    </>
  );
};
