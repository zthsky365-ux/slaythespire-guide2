import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "Georgia, serif",
          padding: "80px",
        }}
      >
        {/* Decorative top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.15)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(168, 85, 247, 0.15)",
            filter: "blur(40px)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            <span style={{ color: "#818cf8" }}>Slay</span> Guide
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#c4b5fd",
              marginBottom: "16px",
              lineHeight: 1.4,
            }}
          >
            Slay the Spire 2 Strategy &amp; Card Guides
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#94a3b8",
              lineHeight: 1.4,
            }}
          >
            Master the Spire with comprehensive guides, strategies, and tips
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{ width: "60px", height: "2px", background: "#6366f1" }} />
          <div style={{ fontSize: "16px", color: "#64748b" }}>www.sxdgame.com</div>
          <div style={{ width: "60px", height: "2px", background: "#6366f1" }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
