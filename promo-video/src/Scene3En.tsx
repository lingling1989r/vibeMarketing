// Scene 3 EN: Consequence - 72% podcasters quit
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

export const Scene3En: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 18], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line1Spring = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 180 } });
  const stat1Spring = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 160 } });
  const stat2Opacity = interpolate(frame, [45, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endOpacity = interpolate(frame, [72, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: bgOpacity }}>
        <Img src={staticFile("images/scene3-quit.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(40%)" }} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(15,12,26,0.82) 0%, rgba(10,8,20,0.90) 60%, rgba(10,8,20,0.97) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 40%, rgba(245,158,11,0.15) 0%, transparent 60%)",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        gap: 26, padding: "0 56px",
      }}>
        <div style={{
          transform: `translateY(${(1 - line1Spring) * -24}px)`,
          opacity: line1Spring, fontSize: 26, color: "#94a3b8", letterSpacing: 1,
        }}>
          The result?
        </div>

        <div style={{ transform: `scale(${0.6 + stat1Spring * 0.4})`, opacity: stat1Spring, textAlign: "center" }}>
          <div style={{
            fontSize: 96, fontWeight: 900, color: "#f59e0b", lineHeight: 1,
            textShadow: "0 0 40px rgba(245,158,11,0.5)",
          }}>72%</div>
          <div style={{ fontSize: 24, color: "#e2d9f3", marginTop: 8, lineHeight: 1.4 }}>
            of podcasters quit<br />
            <strong style={{ color: "#fbbf24" }}>before finding their audience</strong>
          </div>
        </div>

        <div style={{
          opacity: stat2Opacity,
          transform: `translateY(${(1 - stat2Opacity) * 18}px)`,
          padding: "14px 28px",
          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
          borderRadius: 12, textAlign: "center", backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontSize: 20, color: "#d1d5db" }}>
            Average:{" "}
            <span style={{ fontSize: 36, fontWeight: 900, color: "#f59e0b" }}>10</span>
            {" "}episodes then gone
          </span>
        </div>

        <div style={{
          opacity: endOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}>
          <div style={{ fontSize: 15, color: "#7c3aed", letterSpacing: 2 }}>There's a better way</div>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
