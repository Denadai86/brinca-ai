// src/components/DonationPix.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Heart, QrCode, BadgeCheck } from "lucide-react";
import QRCode from "react-qr-code";

type DonationPixProps = {
  pixKey: string;
};

export function DonationPix({ pixKey }: DonationPixProps) {
  const [copied, setCopied] = useState(false);
  const [isSupporter, setIsSupporter] = useState(false);

  /* ---------------- texto A/B ---------------- */
  const variant = useMemo<"emocional" | "tecnico">(() => {
    return Math.random() > 0.5 ? "emocional" : "tecnico";
  }, []);

  /* ---------------- estado apoiador ---------------- */
  useEffect(() => {
    const supporter = localStorage.getItem("brincaai_supporter");
    if (supporter === "true") setIsSupporter(true);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSupporter() {
    localStorage.setItem("brincaai_supporter", "true");
    setIsSupporter(true);
  }

  return (
    <section className="mt-14 rounded-[2.5rem] border border-purple-200 bg-purple-50/70 p-8 md:p-12 shadow-sm">
      <div className="mx-auto max-w-2xl text-center space-y-8">

        {/* ÍCONE */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg">
          {isSupporter ? <BadgeCheck /> : <Heart />}
        </div>

        {/* TEXTO */}
        {!isSupporter ? (
          variant === "emocional" ? (
            <>
              <h3 className="text-2xl font-black text-slate-800">
                Isso te ajudou hoje?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                O Brinca-AI nasceu para apoiar professoras reais,
                com pouco tempo e muitos desafios.
                <br />
                Se essa atividade facilitou seu dia,
                uma doação simbólica mantém o projeto vivo 💜
              </p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-black text-slate-800">
                Apoie o Brinca-AI
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Projeto gratuito, mantido de forma independente.
                <br />
                Doações ajudam com servidores, melhorias e novas ideias.
              </p>
            </>
          )
        ) : (
          <>
            <h3 className="text-2xl font-black text-purple-700">
              💜 Apoiador do Brinca-AI
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Obrigado por fortalecer um projeto feito
              para quem educa com o coração.
            </p>
          </>
        )}

        {/* SUGESTÃO */}
        <p className="text-sm font-semibold text-purple-700">
          Doe R$5, R$10 ou o quanto seu coração mandar 😉
        </p>

        {/* QR + PIX */}
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-md">
              <QRCode value={pixKey} size={140} />
            </div>
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <QrCode size={14} />
              Pix QR Code
            </span>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-inner border border-purple-200">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              Pix copia e cola
            </p>

            <div className="flex flex-col gap-3">
              <code className="rounded-xl bg-slate-100 px-4 py-3 text-xs break-all">
                {pixKey}
              </code>

              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-black text-white hover:bg-purple-700"
              >
                <Copy size={16} />
                {copied ? "Copiado!" : "Copiar chave Pix"}
              </button>
            </div>
          </div>
        </div>

        {/* AÇÃO FINAL */}
        {!isSupporter && (
          <button
            onClick={handleSupporter}
            className="text-xs font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-700"
          >
            Já contribui 💜
          </button>
        )}

        <p className="text-xs text-slate-400">
          Doação opcional. Nenhum valor é obrigatório.
        </p>
      </div>
    </section>
  );
}
