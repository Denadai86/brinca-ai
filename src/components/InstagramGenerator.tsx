"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Camera, 
  X,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { parseActivity } from "@/lib/activity-format";
import { renderCarousel } from "@/lib/instagram-slides";

// Endereço que aparece em todos os slides (e leva gente nova para o app).
const SITE_LABEL = "brinca-ai.acaoleve.com";

interface InstagramGeneratorProps {
  activity: {
    tema: string;
    target: string;
    content: string;
  };
}

type Slide = { blob: Blob; url: string };
type Status = "idle" | "rendering" | "ready" | "error";

function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "atividade"
  );
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob falhou"))),
      "image/png"
    );
  });
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function InstagramGenerator({ activity }: InstagramGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  const baseName = `brinca-ai-${slugify(activity.tema)}`;

  const clearSlides = useCallback(() => {
    setSlides((prev) => {
      prev.forEach((s) => URL.revokeObjectURL(s.url));
      return [];
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setStatus("idle");
    setIndex(0);
    clearSlides();
  }, [clearSlides]);

  async function generate() {
    setOpen(true);
    setStatus("rendering");
    setIndex(0);

    try {
      const parsed = parseActivity(activity.content);
      if (!parsed.titulo) parsed.titulo = activity.tema;

      // Usa a mesma fonte do site; espera ela carregar para o texto não "pular" depois.
      const family = getComputedStyle(document.body).fontFamily || "sans-serif";
      try {
        await Promise.all([
          document.fonts.load(`900 40px ${family}`),
          document.fonts.load(`700 40px ${family}`),
          document.fonts.load(`600 40px ${family}`),
        ]);
      } catch {
        /* sem problema: cai na fonte do sistema */
      }

      const canvases = renderCarousel(
        { activity: parsed, tema: activity.tema, target: activity.target },
        {
          createCanvas: (width, height) => {
            const c = document.createElement("canvas");
            c.width = width;
            c.height = height;
            return c;
          },
          fontFamily: family,
          siteLabel: SITE_LABEL,
        }
      );

      const blobs = await Promise.all(canvases.map(canvasToBlob));
      setSlides(blobs.map((blob) => ({ blob, url: URL.createObjectURL(blob) })));
      setStatus("ready");
    } catch (err) {
      console.error("Erro ao gerar o post:", err);
      setStatus("error");
    }
  }

  const fileName = (i: number) => `${baseName}-${i + 1}.png`;

  async function downloadAll() {
    for (let i = 0; i < slides.length; i++) {
      download(slides[i].blob, fileName(i));
      // o navegador pede permissão uma vez para vários downloads; um respiro ajuda
      await new Promise((r) => setTimeout(r, 350));
    }
  }

  async function shareAll() {
    const files = slides.map((s, i) => new File([s.blob], fileName(i), { type: "image/png" }));
    try {
      await navigator.share({
        files,
        title: activity.tema,
        text: "Atividade criada no Brinca-AI",
      });
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") {
        console.error("Erro ao compartilhar:", err);
        void downloadAll(); // se o compartilhamento falhar, baixa
      }
    }
  }

  const canShareFiles =
    status === "ready" &&
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({
      files: [new File([new Blob()], "x.png", { type: "image/png" })],
    });

  // Esc fecha; setas navegam; trava a rolagem da página enquanto o modal está aberto.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, Math.max(slides.length - 1, 0)));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, slides.length]);

  // Libera as URLs ao desmontar.
  useEffect(() => clearSlides, [clearSlides]);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={generate}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-2 text-pink-600 transition-all hover:from-purple-100 hover:to-pink-100 hover:shadow-sm active:scale-95"
      >
        <Camera size={18} />
        <span className="font-medium text-xs sm:text-sm">Gerar Post</span>
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Post para o Instagram"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-3 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="relative flex max-h-full w-full max-w-md flex-col gap-4 overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
              <button
                type="button"
                onClick={close}
                aria-label="Fechar"
                className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

              <div className="pr-8">
                <h3 className="text-lg font-black text-slate-800">
                  {status === "ready" ? "Seu post está pronto! 🎉" : "Preparando seu post…"}
                </h3>
                {status === "ready" && (
                  <p className="text-sm text-slate-500">
                    São {slides.length} slides para postar como carrossel. Deslize para conferir.
                  </p>
                )}
              </div>

              {status === "rendering" && (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-slate-50 text-purple-500">
                  <Loader2 className="animate-spin" size={32} />
                </div>
              )}

              {status === "error" && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                >
                  Ops, não consegui montar o post agora. Feche e tente de novo, tá?
                </div>
              )}

              {status === "ready" && slides.length > 0 && (
                <>
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slides[index].url}
                      alt={`Slide ${index + 1} de ${slides.length}`}
                      className="aspect-[4/5] w-full object-contain"
                    />

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => setIndex(index - 1)}
                        aria-label="Slide anterior"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md hover:bg-white"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}
                    {index < slides.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setIndex(index + 1)}
                        aria-label="Próximo slide"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md hover:bg-white"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
                    {slides.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? "w-6 bg-purple-500" : "w-2 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    {canShareFiles && (
                      <button
                        type="button"
                        onClick={shareAll}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-md transition-transform active:scale-95"
                      >
                        <Share2 size={18} /> Compartilhar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={downloadAll}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-transform active:scale-95 ${
                        canShareFiles
                          ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          : "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                      }`}
                    >
                      <Download size={18} /> Baixar todos
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => download(slides[index].blob, fileName(index))}
                    className="text-center text-xs font-medium text-slate-400 underline-offset-2 hover:text-purple-600 hover:underline"
                  >
                    Baixar só este slide
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
