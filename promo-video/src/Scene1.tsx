// Scene 1 v2: Hook - recording takes 1 hour - with real background image
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 91], [1.05, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const overlayOpacity = interpolate(frame, [0, 20], [0, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const micScale = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 180 } });
  const textOpacity = interpolate(frame, [10, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hourSpring = spring({ frame: frame - 35, fps, config: { damping: 10, stiffness: 200 } });
  const subtextOpacity = interpolate(frame, [62, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Background image with slow zoom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${bgScale})`,
          transformOrigin: "center",
        }}
      >
        <Img
          src={staticFile("images/scene1-mic.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,10,26,0.75) 0%, rgba(10,10,26,0.88) 60%, rgba(10,10,26,0.96) 100%)",
          opacity: overlayOpacity,
        }}
      />

      {/* Purple tint glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.25) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif",
          gap: 20,
          padding: "0 60px",
        }}
      >
        {/* Mic icon */}
        <div style={{ transform: `scale(${0.4 + micScale * 0.6})`, opacity: micScale }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
            <path d="M5 10a7 7 0 0014 0" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <line x1="12" y1="17" x2="12" y2="21" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="21" x2="16" y2="21" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div
          style={{
            opacity: textOpacity,
            fontSize: 38,
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: 3,
            textAlign: "center",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          录制一期播客
        </div>

        {/* "1小时" big number */}
        <div
          style={{
            transform: `scale(${0.4 + hourSpring * 0.6})`,
            opacity: hourSpring,
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            filter: "drop-shadow(0 0 30px rgba(167,139,250,0.7))",
          }}
        >
          <span style={{ fontSize: 120, fontWeight: 900, color: "#a78bfa", lineHeight: 1 }}>1</span>
          <span style={{ fontSize: 44, fontWeight: 700, color: "#7c3aed" }}>小时</span>
        </div>

        <div
          style={{
            opacity: subtextOpacity,
            fontSize: 22,
            color: "#94a3b8",
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          但之后呢...
        </div>
      </div>
    </div>
  );
};
