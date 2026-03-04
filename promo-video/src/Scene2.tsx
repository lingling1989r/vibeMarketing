// Scene 2 v2: The Problem - editing takes 5-8 hours
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgY = interpolate(frame, [0, 78], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const overlayOpacity = interpolate(frame, [0, 15], [0, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hoursSpring = spring({ frame: frame - 18, fps, config: { damping: 8, stiffness: 140 } });

  const statOpacity = interpolate(frame, [48, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shake after number appears
  const shake = frame > 30 && frame < 48
    ? Math.sin((frame - 30) * 1.5) * 5 * Math.exp(-(frame - 30) * 0.12)
    : 0;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Background image with pan up */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${bgY}px) scale(1.06)`,
        }}
      >
        <Img
          src={staticFile("images/scene2-clock.jpg")}
          style={{ width: "100%", height: "110%", objectFit: "cover" }}
        />
      </div>

      {/* Dark red overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(26,5,5,0.80) 0%, rgba(40,10,10,0.90) 50%, rgba(26,5,5,0.95) 100%)",
          opacity: overlayOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 45%, rgba(220,38,38,0.20) 0%, transparent 60%)",
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
          gap: 22,
          padding: "0 60px",
        }}
      >
        {/* Clock icon */}
        <div style={{ opacity: titleOpacity }}>
          <svg width="68" height="68" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8" />
            <polyline points="12 6 12 12 16 14" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div
          style={{
            opacity: titleOpacity,
            fontSize: 34,
            fontWeight: 600,
            color: "#fca5a5",
            letterSpacing: 2,
            textAlign: "center",
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
          }}
        >
          剪辑却要...
        </div>

        {/* Big number with shake */}
        <div
          style={{
            transform: `scale(${0.3 + hoursSpring * 0.7}) translateX(${shake}px)`,
            opacity: Math.min(hoursSpring * 1.5, 1),
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 108,
              fontWeight: 900,
              color: "#ef4444",
              lineHeight: 1,
              textShadow: "0 0 50px rgba(239,68,68,0.8)",
            }}
          >
            5-8
          </span>
          <span style={{ fontSize: 42, fontWeight: 700, color: "#dc2626" }}>小时！</span>
        </div>

        {/* Data badge */}
        <div
          style={{
            opacity: statOpacity,
            transform: `translateY(${(1 - statOpacity) * 20}px)`,
            padding: "12px 24px",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: 10,
            fontSize: 18,
            color: "#fca5a5",
            textAlign: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          55% 播客人每期花超 <strong style={{ color: "#ef4444" }}>5小时</strong> 后期
        </div>
      </div>
    </div>
  );
};
