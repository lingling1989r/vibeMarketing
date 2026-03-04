// Scene 5 v2: CTA - Focus on content, not editing
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 80], [1.08, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const overlayOpacity = interpolate(frame, [0, 16], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineSpring = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 200 } });
  const line2Opacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dividerOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlSpring = spring({ frame: frame - 38, fps, config: { damping: 10, stiffness: 180 } });
  const subSpring = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 150 } });

  // Pulsing URL glow
  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.2);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Background - happy podcaster */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${bgScale})`,
          transformOrigin: "center",
        }}
      >
        <Img
          src={staticFile("images/scene5-happy.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(8,8,20,0.78) 0%, rgba(10,8,25,0.88) 55%, rgba(8,8,20,0.96) 100%)",
          opacity: overlayOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.22) 0%, transparent 55%)",
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
        }}
      >
        {/* Tagline */}
        <div
          style={{
            transform: `scale(${0.75 + taglineSpring * 0.25})`,
            opacity: taglineSpring,
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: "#f1f5f9", letterSpacing: 3 }}>
            专注创作内容
          </div>
        </div>

        <div
          style={{
            opacity: line2Opacity,
            fontSize: 40,
            fontWeight: 800,
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 3,
            textAlign: "center",
            filter: "drop-shadow(0 0 15px rgba(167,139,250,0.4))",
          }}
        >
          不是后期剪辑
        </div>

        {/* Divider */}
        <div
          style={{
            opacity: dividerOpacity,
            width: 90,
            height: 2,
            background: "linear-gradient(90deg, transparent, #7c3aed, transparent)",
            borderRadius: 2,
          }}
        />

        {/* URL */}
        <div
          style={{
            transform: `scale(${0.7 + urlSpring * 0.3})`,
            opacity: urlSpring,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#a78bfa",
              letterSpacing: 3,
              textShadow: `0 0 ${20 + pulse * 20}px rgba(167,139,250,0.7)`,
            }}
          >
            podaha.com
          </div>
        </div>

        {/* Free badge */}
        <div
          style={{
            transform: `translateY(${(1 - subSpring) * 20}px)`,
            opacity: subSpring,
            padding: "8px 22px",
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(167,139,250,0.35)",
            borderRadius: 24,
          }}
        >
          <span style={{ fontSize: 16, color: "#c4b5fd", letterSpacing: 2 }}>
            ✨ 免费开始，无需信用卡
          </span>
        </div>
      </div>
    </div>
  );
};
