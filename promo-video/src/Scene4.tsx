// Scene 4 v2: Solution - PodAha AI with real AI background image
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

const Feature: React.FC<{ icon: string; text: string; spring: number }> = ({ icon, text, spring: sp }) => (
  <div
    style={{
      transform: `translateX(${(1 - sp) * -70}px)`,
      opacity: sp,
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "11px 20px",
      background: "rgba(124,58,237,0.14)",
      borderRadius: 10,
      border: "1px solid rgba(167,139,250,0.28)",
      backdropFilter: "blur(6px)",
    }}
  >
    <span style={{ fontSize: 24 }}>{icon}</span>
    <span
      style={{
        fontSize: 19,
        color: "#e2d9f3",
        fontWeight: 500,
        fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {text}
    </span>
  </div>
);

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 130], [1.0, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoSpring = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const f1 = spring({ frame: frame - 22, fps, config: { damping: 14, stiffness: 160 } });
  const f2 = spring({ frame: frame - 36, fps, config: { damping: 14, stiffness: 160 } });
  const f3 = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 160 } });
  const f4 = spring({ frame: frame - 64, fps, config: { damping: 14, stiffness: 160 } });
  const timeSpring = spring({ frame: frame - 90, fps, config: { damping: 10, stiffness: 150 } });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Background - AI visual */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${bgScale})`,
          transformOrigin: "center",
        }}
      >
        <Img
          src={staticFile("images/scene4-ai.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Deep overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(8,6,20,0.88) 0%, rgba(10,8,25,0.92) 50%, rgba(8,6,20,0.97) 100%)",
        }}
      />
      {/* Purple glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.28) 0%, transparent 55%)",
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
          gap: 18,
          padding: "0 48px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${0.5 + logoSpring * 0.5})`,
            opacity: logoSpring,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontSize: 50,
              fontWeight: 900,
              background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 4,
              filter: "drop-shadow(0 0 20px rgba(167,139,250,0.6))",
            }}
          >
            PodAha
          </div>
          <div style={{ fontSize: 15, color: "#7c3aed", letterSpacing: 5, marginTop: 4 }}>
            AI 播客生产平台
          </div>
        </div>

        {/* Feature list */}
        <Feature icon="🎙️" text="AI 智能降噪 & 去除语气词" spring={f1} />
        <Feature icon="📝" text="自动转录 & 生成节目说明" spring={f2} />
        <Feature icon="✂️" text="一键提取精华社交片段" spring={f3} />
        <Feature icon="🚀" text="一键发布 Spotify & Apple" spring={f4} />

        {/* Time badge */}
        <div
          style={{
            transform: `scale(${0.7 + timeSpring * 0.3})`,
            opacity: timeSpring,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "13px 28px",
            background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(56,189,248,0.15))",
            borderRadius: 14,
            border: "1px solid rgba(167,139,250,0.45)",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 16, color: "#94a3b8" }}>全流程仅需</span>
          <span
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: "#a78bfa",
              textShadow: "0 0 25px rgba(167,139,250,0.6)",
            }}
          >
            1 小时
          </span>
          <span style={{ fontSize: 16, color: "#94a3b8" }}>发布</span>
        </div>
      </div>
    </div>
  );
};
