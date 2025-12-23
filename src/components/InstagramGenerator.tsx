"use client";

import { Instagram, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { useRef, useState, useMemo } from "react";

interface InstagramGeneratorProps {
  content: string;
  theme: string;
  age: string;
}

export function InstagramGenerator({
  content,
  theme,
  age,
}: InstagramGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // ===============================
  // 🧠 PROCESSAMENTO ISOLADO
  // ===============================
  const { title, materials, steps } = useMemo(() => {
    if (!content?.trim()) {
      return {
        title: theme || "Atividade Criativa",
        materials:
          "• Papel\n• Canetinhas ou lápis de cor\n• Tesoura sem ponta\n• Cola",
        steps:
          "1. Reúna os materiais\n2. Explique a atividade\n3. Estimule a criatividade\n4. Celebre juntos",
      };
    }

    return {
      title: theme || "Atividade Criativa",
      materials:
        "• Papel\n• Canetinhas ou lápis de cor\n• Tesoura sem ponta\n• Cola",
      steps:
        "1. Reúna os materiais\n2. Explique a atividade\n3. Estimule a criatividade\n4. Celebre juntos",
    };
  }, [content, theme]);

  // ===============================
  // 📸 DOWNLOAD PNG
  // ===============================
  async function handleDownload() {
    if (!cardRef.current) return;

    setLoading(true);

    try {
      await new Promise(r => setTimeout(r, 200));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `brinca-ai-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar imagem");
    } finally {
      setLoading(false);
    }
  }

  if (!content && !theme) return null;

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-xl font-bold"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Instagram size={18} />
        )}
        Baixar Post
      </button>

      {/* CARD OFFSCREEN */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={cardRef}
          className="w-[1080px] h-[1080px] bg-white flex items-center justify-center"
        >
          <div className="w-[90%] h-[90%] rounded-[48px] border p-16 flex flex-col justify-between">
            <div>
              <h2 className="text-5xl font-bold">Brinca-AI</h2>
              <p className="text-xl text-gray-500">acaoleve.com</p>
            </div>

            <div>
              <p className="uppercase text-purple-500 font-bold">{theme}</p>
              <h1 className="text-6xl font-extrabold">{title}</h1>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-2">Materiais</h3>
              <p className="whitespace-pre-line text-2xl">{materials}</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-2">Como Fazer</h3>
              <p className="whitespace-pre-line text-2xl">{steps}</p>
            </div>

            <div className="text-center text-xl text-gray-600">
              Idade: {age || "Geral"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
