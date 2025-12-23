// src/components/ActivityCard.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Heart, Trophy } from "lucide-react";
import { InstagramGenerator } from "@/components/InstagramGenerator";
import { toggleLikeAction } from "@/lib/actions";

interface ActivityCardProps {
  activity?: any;
  content?: string;
  index: number;
}

export function ActivityCard({ activity, index }: ActivityCardProps) {
  const [likes, setLikes] = useState(activity.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Lógica do Top 3
  const isTop = index < 3;
  
  async function handleLike() {
    if (isLiked) return; // Evita flood de likes (opcional)
    
    // UI Optimistic (Atualiza na tela antes de ir pro banco para ser instantâneo)
    setLikes((prev: number) => prev + 1);
    setIsLiked(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // Para animação do coração

    // Salva no banco em background
    await toggleLikeAction(activity.id);
  }

  return (
    <div className={`group h-full flex flex-col relative transition-all duration-300 ${isTop ? 'scale-105 z-10' : 'hover:-translate-y-1'}`}>
      
      {/* 🏆 MEDALHA TOP 3 (Só aparece nos primeiros) */}
      {isTop && (
        <div className="absolute -top-4 -right-4 z-20 bg-yellow-400 text-yellow-900 font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform rotate-12 animate-in zoom-in">
          <Trophy size={16} />
          TOP {index + 1}
        </div>
      )}

      <article className={`bg-white rounded-2xl p-6 border shadow-sm h-full flex flex-col relative
        ${isTop ? 'border-yellow-400 shadow-xl ring-4 ring-yellow-400/20' : 'border-slate-200 hover:shadow-xl'}
      `}>
        
        {/* Link Principal */}
        <Link href={`/atividade/${activity.id}`} className="flex-grow">
          
          {/* Identidade da Professora */}
          {activity.authorName && (
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-full bg-purple-100 border-2 border-purple-200 overflow-hidden flex items-center justify-center shrink-0">
                {activity.authorPhoto ? (
                  <img src={activity.authorPhoto} alt={activity.authorName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-purple-700 font-bold text-sm">{activity.authorName.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-slate-700 truncate w-full">{activity.authorName}</span>
                {activity.instagramHandle && (
                  <span className="text-[10px] text-slate-400 font-medium truncate">@{activity.instagramHandle}</span>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${isTop ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-700'}`}>
              {activity.tema}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Conteúdo */}
          <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {activity.target}
          </h3>
          <div className="text-sm text-slate-500 line-clamp-3 mb-6">
            {activity.content.replace(/\[.*?\]/g, "")}
          </div>
        </Link>

        {/* 👇 BARRA DE AÇÕES (Rodapé Interativo) 👇 */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          
          {/* BOTÃO DE LIKE ❤️ */}
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm font-bold transition-all ${isLiked ? 'text-pink-600' : 'text-slate-400 hover:text-pink-500'}`}
          >
            <Heart 
              size={18} 
              className={`transition-all ${isLiked ? 'fill-pink-600 scale-110' : ''} ${isAnimating ? 'animate-bounce' : ''}`} 
            />
            {likes > 0 && <span>{likes}</span>}
          </button>

          {/* Gerador de Post */}
          <div className="scale-90">
             <InstagramGenerator content={activity.content} theme={activity.tema} age={activity.target} />
          </div>

          {/* Link Detalhes */}
          <Link href={`/atividade/${activity.id}`} className="text-purple-600">
             <ArrowRight size={20} />
          </Link>

        </div>
      </article>
    </div>
  );
}