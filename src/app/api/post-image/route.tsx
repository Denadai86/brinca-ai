import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Payload esperado via POST:
 * {
 *   title: string;
 *   theme: string;
 *   materials: string;
 *   steps: string;
 *   age: string;
 * }
 */

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    title = "Atividade Criativa",
    theme = "Atividade",
    materials = "",
    steps = "",
    age = "Geral",
  } = body;

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
            "linear-gradient(135deg, #7C3AED, #EC4899, #FB923C)",
          padding: 48,
          fontFamily: "Inter",
        }}
      >
        {/* Card branco */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
            borderRadius: 48,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#F3E8FF",
              padding: "40px 48px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  backgroundColor: "#7C3AED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  color: "#fff",
                }}
              >
                🚀
              </div>
              <div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#4C1D95",
                  }}
                >
                  BrincaAI
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: "#7C3AED",
                  }}
                >
                  acaoleve.com
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#E9D5FF",
                padding: "12px 28px",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 700,
                color: "#4C1D95",
              }}
            >
              {age} (idade)
            </div>
          </div>

          {/* Conteúdo */}
          <div
            style={{
              flex: 1,
              padding: 48,
              display: "flex",
              flexDirection: "column",
              gap: 36,
            }}
          >
            {/* Título */}
            <div>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: 4,
                  fontWeight: 700,
                  color: "#A855F7",
                  marginBottom: 12,
                }}
              >
                {theme.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.1,
                  maxHeight: 130,
                  overflow: "hidden",
                }}
              >
                {title}
              </div>
            </div>

            {/* Materiais */}
            <div
              style={{
                backgroundColor: "#FEFCE8",
                borderLeft: "12px solid #FACC15",
                borderRadius: 24,
                padding: 32,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#A16207",
                  marginBottom: 12,
                }}
              >
                🛠 Materiais
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: "#334155",
                  whiteSpace: "pre-line",
                  lineHeight: 1.4,
                  maxHeight: 160,
                  overflow: "hidden",
                }}
              >
                {materials}
              </div>
            </div>

            {/* Passos */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#7C3AED",
                  marginBottom: 16,
                }}
              >
                👣 Como Fazer
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#475569",
                  whiteSpace: "pre-line",
                  lineHeight: 1.45,
                  maxHeight: 260,
                  overflow: "hidden",
                }}
              >
                {steps}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#020617",
              color: "#fff",
              textAlign: "center",
              padding: 24,
              fontSize: 22,
            }}
          >
            Gere atividades em{" "}
            <span style={{ color: "#F472B6", fontWeight: 700 }}>
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
