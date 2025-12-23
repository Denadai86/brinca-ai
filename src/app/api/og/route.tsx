import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") ?? "Atividade Criativa";
  const theme = searchParams.get("theme") ?? "Brinca-AI";
  const age = searchParams.get("age") ?? "Geral";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #7c3aed, #ec4899, #fb923c)",
          padding: "48px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "48px",
            width: "100%",
            height: "100%",
            padding: "64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#6d28d9" }}>
                Brinca-AI
              </div>
              <div style={{ fontSize: 24, color: "#9333ea" }}>
                acaoleve.com
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#ede9fe",
                color: "#5b21b6",
                padding: "16px 32px",
                borderRadius: "999px",
                fontSize: 28,
                fontWeight: 700,
                height: "fit-content",
              }}
            >
              {age}
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 4,
                color: "#a855f7",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {theme}
            </div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1.1,
                color: "#111827",
                maxHeight: "3.2em",
                overflow: "hidden",
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#0f172a",
              color: "#ffffff",
              textAlign: "center",
              padding: "24px",
              borderRadius: "24px",
              fontSize: 26,
            }}
          >
            Gere atividades em{" "}
            <span style={{ color: "#f472b6", fontWeight: 700 }}>
              acaoleve.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    },
  );
}
