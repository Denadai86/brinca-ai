// src/components/DonationPix.tsx

"use client";

import { useState } from "react";
import { Copy, Check, Heart } from "lucide-react";

// 1. Definimos a Interface das Props
interface DonationPixProps {
  pixKey: string;
}

export function DonationPix({ pixKey }: DonationPixProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reseta após 2s
  };

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mb-4 flex items-center justify-center gap-2 text-pink-600">
        <Heart className="fill-pink-600 animate-pulse" size={20} />
        <span className="text-sm font-bold uppercase tracking-widest">Apoie o projeto</span>
      </div>

      <h4 className="mb-2 text-lg font-bold text-slate-800">
        Gostou da atividade?
      </h4>
      <p className="mb-6 text-sm text-slate-500">
        Este gerador é gratuito. Se ele te ajudou a economizar tempo, considere fazer um Pix de qualquer valor para manter o servidor no ar! ☕
      </p>

      <div className="relative flex items-center gap-2 rounded-xl bg-slate-100 p-2 pr-3 border border-slate-200">
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-3 text-sm font-medium text-slate-600">
          {pixKey}
        </div>
        
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
            copied
              ? "bg-green-500 text-white shadow-green-200 shadow-lg"
              : "bg-white text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200"
          }`}
        >
          {copied ? (
            <>
              <Check size={16} />
              Copiado!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copiar
            </>
          )}
        </button>
      </div>
      
      <p className="mt-3 text-xs text-slate-400">
        Chave Pix (E-mail ou Aleatória)
      </p>
    </div>
  );
}