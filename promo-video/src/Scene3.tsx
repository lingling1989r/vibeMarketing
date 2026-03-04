// Scene 3 v2: Consequence - most podcasters quit
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 18], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line1Spring = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 180 } });
  const stat1Spring = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 160 } });
  const stat2Opacity = interpolate(frame, [45, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const endOpacity = interpolate(frame, [72, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, opacity: bgOpacity }}>
        <Img
          src={staticFile("images/scene3-quit.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(40%)" }}
        />
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(15,12,26,0.82) 0%, rgba(10,8,20,0.90) 60%, rgba(10,8,20,0.97) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(245,158,11,0.15) 0%, transparent 60%)",
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
          gap: 26,
          padding: "0 56px",
        }}
      >
        <div
          style={{
            transform: `translateY(${(1 - line1Spring) * -24}px)`,
            opacity: line1Spring,
            fontSize: 26,
            color: "#94a3b8",
            letterSpacing: 2,
          }}
        >
          结果就是...
        </div>

        {/* Big % stat */}
        <div
          style={{
            transform: `scale(${0.6 + stat1Spring * 0.4})`,
            opacity: stat1Spring,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#f59e0b",
              lineHeight: 1,
              textShadow: "0 0 40px rgba(245,158,11,0.5)",
            }}
          >
            72%
          </div>
          <div style={{ fontSize: 24, color: "#e2d9f3", marginTop: 8, lineHeight: 1.4 }}>
            播客人找不到听众
            <br />
            <strong style={{ color: "#fbbf24" }}>选择放弃</strong>
          </div>
        </div>

        {/* Second stat */}
        <div
          style={{
            opacity: stat2Opacity,
            transform: `translateY(${(1 - stat2Opacity) * 18}px)`,
            padding: "14px 28px",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: 12,
            textAlign: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <span style={{ fontSize: 20, color: "#d1d5db" }}>
            平均只坚持{" "}
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#f59e0b",
              }}
            >
              10
            </span>{" "}
            期就停播
          </span>
        </div>

        {/* Turn indicator */}
        <div
          style={{
            opacity: endOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ fontSize: 15, color: "#7c3aed", letterSpacing: 2 }}>改变这一切</div>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
