import React from "react";
import { Composition } from "remotion";
import { PodAhaPromo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PodAhaPromo"
        component={PodAhaPromo}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="PodAhaPromo16x9"
        component={PodAhaPromo}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
