// src/components/DynamicSubmitButton.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, Wand2 } from "lucide-react";

interface DynamicSubmitButtonProps {
  isPending: boolean;
}

export function DynamicSubmitButton({ isPending }: DynamicSubmitButtonProps) {
  const mensagens = [
    "Lendo a mente das crianças...",
    "Vasculhando a sala de aula...",
    "Consultando a BNCC...",
    "Misturando criatividade e sucata...",
    "Desenhando o passo a passo...",
    "Finalizando a mágica..."
  ];

  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (!isPending) {
      setIndice(0);
      return;
    }

    const timer = setInterval(() => {
      setIndice((atual) => (atual + 1 < mensagens.length ? atual + 1 : atual));
    }, 4500); // Troca a mensagem a cada 4.5 segundos

    return () => clearInterval(timer);
  }, [isPending]);

  return (
    <button
      type="submit"
      disabled={isPending}
      className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
        isPending
          ? "bg-purple-100 text-purple-600 cursor-not-allowed scale-[0.98] border border-purple-200"
          : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-[1.01] active:scale-95 hover:shadow-purple-500/30"
      }`}
    >
      {isPending ? (
        <>
          <Loader2 size={24} className="animate-spin text-purple-600" />
          <span className="animate-pulse">{mensagens[indice]}</span>
        </>
      ) : (
        <>
          <Wand2 size={24} />
          GERAR ATIVIDADES
        </>
      )}
    </button>
  );
}