// Twitter image cards for PodAha
// 1200x675 (16:9) - optimal for Twitter/X link cards and media posts
import React from "react";

const BRAND = "#7c3aed";
const BRAND_LIGHT = "#a78bfa";
const BG = "#0a0a1a";
const BG2 = "#0f0f23";

// ── Shared layout shell ──────────────────────────────────────────────────────
const CardShell: React.FC<{ children: React.ReactNode; accent?: string }> = ({
  children, accent = BRAND,
}) => (
  <div style={{
    width: "100%", height: "100%", background: BG,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    position: "relative", overflow: "hidden",
    display: "flex", flexDirection: "column",
  }}>
    {/* Top accent bar */}
    <div style={{ height: 6, background: `linear-gradient(90deg, ${accent}, #60a5fa)`, flexShrink: 0 }} />
    {/* Purple radial glow */}
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(ellipse at 20% 50%, ${accent}22 0%, transparent 55%)`,
      pointerEvents: "none",
    }} />
    {/* Grid dots background */}
    <div style={{
      position: "absolute", inset: 0, opacity: 0.04,
      backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      pointerEvents: "none",
    }} />
    {/* Content */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "44px 64px 36px", position: "relative" }}>
      {children}
    </div>
    {/* Footer bar */}
    <div style={{
      height: 48, borderTop: "1px solid rgba(124,58,237,0.2)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 64px", flexShrink: 0,
    }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: BRAND_LIGHT, letterSpacing: 2 }}>PodAha</span>
      <span style={{ fontSize: 13, color: "#475569" }}>podaha.com</span>
    </div>
  </div>
);

// ── Card 1: Time comparison bar chart ───────────────────────────────────────
export const CardTime: React.FC = () => (
  <CardShell>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
      The Podcast Production Problem
    </div>
    <div style={{ fontSize: 42, fontWeight: 900, color: "#f1f5f9", lineHeight: 1.15, marginBottom: 36 }}>
      Why creators<br />burn out before they<br />
      <span style={{ color: BRAND_LIGHT }}>find an audience</span>
    </div>

    {/* Bar chart */}
    <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
      {/* Recording bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 500 }}>🎙️ Recording</span>
          <span style={{ fontSize: 16, color: "#64748b" }}>1 hour</span>
        </div>
        <div style={{ height: 28, background: "#1e1b4b", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: "12.5%", height: "100%", background: "#6366f1", borderRadius: 4 }} />
        </div>
      </div>
      {/* Editing bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 16, color: "#fca5a5", fontWeight: 600 }}>✂️ Editing + Post-production</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>5–8 hours</span>
        </div>
        <div style={{ height: 28, background: "#1e1b4b", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #dc2626, #ef4444)", borderRadius: 4 }} />
        </div>
        <div style={{
          marginTop: 8, padding: "6px 14px", display: "inline-block",
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 6, fontSize: 13, color: "#fca5a5",
        }}>← THIS is what kills consistency</div>
      </div>
    </div>
  </CardShell>
);

// ── Card 2: 72% stat ─────────────────────────────────────────────────────────
export const CardStats: React.FC = () => (
  <CardShell accent="#f59e0b">
    <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>
      Industry Data
    </div>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 48, flex: 1 }}>
      {/* Left: Big stat */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{
          fontSize: 128, fontWeight: 900, color: "#f59e0b", lineHeight: 1,
          textShadow: "0 0 60px rgba(245,158,11,0.3)",
        }}>72%</div>
        <div style={{ fontSize: 20, color: "#d1d5db", marginTop: 8, lineHeight: 1.4, maxWidth: 260 }}>
          of podcasters quit<br />
          <strong style={{ color: "#fbbf24" }}>before finding their audience</strong>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, background: "rgba(245,158,11,0.2)", alignSelf: "stretch" }} />

      {/* Right: Supporting stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28, justifyContent: "center", flex: 1 }}>
        {[
          { num: "10", label: "avg episodes before quitting" },
          { num: "5-8h", label: "post-production per episode" },
          { num: "#1", label: "reason: production burnout" },
        ].map(({ num, label }) => (
          <div key={num}>
            <div style={{ fontSize: 36, fontWeight: 900, color: BRAND_LIGHT, lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: 15, color: "#64748b", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  </CardShell>
);

// ── Card 3: Before → After workflow ─────────────────────────────────────────
export const CardWorkflow: React.FC = () => (
  <CardShell>
    <div style={{ fontSize: 13, fontWeight: 600, color: BRAND_LIGHT, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>
      The PodAha Difference
    </div>
    <div style={{ fontSize: 34, fontWeight: 800, color: "#f1f5f9", marginBottom: 32 }}>
      From upload to published.<br />
      <span style={{ color: BRAND_LIGHT }}>Under 1 hour.</span>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 0, flex: 1, alignItems: "stretch" }}>
      {/* Before */}
      <div style={{
        background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 12, padding: "20px 24px",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", letterSpacing: 2, marginBottom: 16 }}>BEFORE</div>
        {["🎙️ Record (1h)", "🔇 Noise cleanup (45m)", "📝 Transcript edit (60m)", "✍️ Show notes (45m)", "✂️ Social clips (60m)", "📤 Publishing (30m)"].map(step => (
          <div key={step} style={{ fontSize: 14, color: "#94a3b8", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {step}
          </div>
        ))}
        <div style={{ marginTop: 12, fontSize: 15, fontWeight: 700, color: "#ef4444" }}>Total: 5-8 hours</div>
      </div>

      {/* Arrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke={BRAND_LIGHT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* After */}
      <div style={{
        background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 12, padding: "20px 24px",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: BRAND_LIGHT, letterSpacing: 2, marginBottom: 16 }}>WITH PODAHA</div>
        {["🎙️ Record (1h)", "⚡ Upload to PodAha", "🤖 AI handles everything", "👀 Quick review", "🚀 Publish"].map(step => (
          <div key={step} style={{ fontSize: 14, color: "#c4b5fd", padding: "6px 0", borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
            {step}
          </div>
        ))}
        <div style={{ marginTop: 12, fontSize: 15, fontWeight: 700, color: BRAND_LIGHT }}>Total: &lt; 1 hour ✅</div>
      </div>
    </div>
  </CardShell>
);

// ── Card 4: PH Launch (D-7 countdown) ───────────────────────────────────────
export const CardLaunch: React.FC = () => (
  <CardShell accent="#f59e0b">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
          🚀 Launching on Product Hunt
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, color: "#f1f5f9", lineHeight: 1, marginBottom: 12 }}>
          PodAha
        </div>
        <div style={{
          fontSize: 20, fontWeight: 500,
          background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 28,
        }}>
          AI Podcast Post-Production
        </div>
        <div style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
          Upload audio → get transcript + show notes +<br />
          social clips + published podcast.
        </div>

        {/* Key metrics */}
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { num: "8h→1h", label: "time saved" },
            { num: "50+", label: "beta users" },
            { num: "Free", label: "to start" },
          ].map(({ num, label }) => (
            <div key={num}>
              <div style={{ fontSize: 24, fontWeight: 800, color: BRAND_LIGHT }}>{num}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Countdown box */}
      <div style={{
        background: "rgba(245,158,11,0.1)", border: "2px solid rgba(245,158,11,0.4)",
        borderRadius: 16, padding: "28px 36px", textAlign: "center", flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, color: "#f59e0b", letterSpacing: 2, marginBottom: 8 }}>LAUNCHING IN</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#f59e0b", lineHeight: 1 }}>7</div>
        <div style={{ fontSize: 16, color: "#d97706", marginTop: 4 }}>days</div>
      </div>
    </div>
  </CardShell>
);

// ── Card 5: Feature overview ─────────────────────────────────────────────────
export const CardFeatures: React.FC = () => (
  <CardShell>
    <div style={{ fontSize: 13, fontWeight: 600, color: BRAND_LIGHT, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
      What PodAha Does
    </div>
    <div style={{ fontSize: 38, fontWeight: 800, color: "#f1f5f9", marginBottom: 32, lineHeight: 1.2 }}>
      The full post-production<br />
      pipeline. <span style={{ color: BRAND_LIGHT }}>Automated.</span>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flex: 1 }}>
      {[
        { icon: "🎙️", title: "AI Noise Removal", desc: "Clean audio automatically. Remove filler words." },
        { icon: "📝", title: "Auto Transcript", desc: "Timestamped, speaker-labeled, ready in minutes." },
        { icon: "✍️", title: "Show Notes", desc: "AI writes structured show notes from your content." },
        { icon: "✂️", title: "Social Clips", desc: "Best moments extracted for Twitter, TikTok, Reels." },
      ].map(({ icon, title, desc }) => (
        <div key={title} style={{
          padding: "18px 20px",
          background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e2d9f3", marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{desc}</div>
        </div>
      ))}
    </div>

    <div style={{
      marginTop: 16, padding: "10px 20px",
      background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(56,189,248,0.1))",
      border: "1px solid rgba(167,139,250,0.3)", borderRadius: 8,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
    }}>
      <span style={{ fontSize: 14, color: "#94a3b8" }}>Upload audio</span>
      <span style={{ color: BRAND_LIGHT }}>→</span>
      <span style={{ fontSize: 14, color: "#94a3b8" }}>AI processes</span>
      <span style={{ color: BRAND_LIGHT }}>→</span>
      <span style={{ fontSize: 14, color: BRAND_LIGHT, fontWeight: 600 }}>Published in &lt;1 hour</span>
    </div>
  </CardShell>
);
