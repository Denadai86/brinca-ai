"use client";

import { Crown, Heart } from "lucide-react"; // Crown é mais premium
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useState } from "react";

type Props = {
  isCompact?: boolean;
};

export function SupporterBadge({ isCompact = false }: Props) {
  const { user, profile, loading } = useAuth();
  
  // Confia mais no profile do Firestore do que no localStorage para evitar fraudes simples
  const isSupporter = profile?.isSupporter || false;

  if (loading || !user) return null;

  if (!isSupporter) {
    // Opcional: Mostrar botão "Vire Apoiador" cinza se quiser upsell
    return null;
  }

  return (
    <div
      className={`
        flex items-center gap-2 rounded-full border border-yellow-200 
        bg-gradient-to-r from-yellow-50 to-amber-100 text-amber-700 shadow-sm 
        transition-all hover:shadow-md cursor-default select-none
        ${isCompact ? "px-2 py-0.5 text-xs" : "px-4 py-1.5 text-sm"}
      `}
      title="Usuário Apoiador Oficial"
    >
      {/* Ícone dourado e com preenchimento */}
      <Crown 
        className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} fill-yellow-500 text-yellow-600`} 
      />
      
      {!isCompact && (
        <span className="font-bold tracking-wide">
          Apoiador <span className="text-yellow-600">PRO</span>
        </span>
      )}
    </div>
  );
}