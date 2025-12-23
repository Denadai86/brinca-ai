"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Heart, Trophy } from "lucide-react";
import { InstagramGenerator } from "@/components/InstagramGenerator";
import { toggleLikeAction } from "@/lib/actions";

interface ActivityCardProps {
  activity: {
    id: string;
    tema: string;
    target: string;
    content: string;
    createdAt: string | Date;
    likes?: number;
    authorName?: string;
    authorPhoto?: string;
    instagramHandle?: string;
    [key: string]: any;
  };
  index: number;
}

export function ActivityCard({ activity, index }: ActivityCardProps) {
  const [likes, setLikes] = useState(activity.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Lógica do Top 3
  const isTop = index < 3;
  const rankColors = [
    "bg-yellow-400 text-yellow-900 ring-yellow-400/30", // 1º Ouro
    "bg-slate-300 text-slate-800 ring-slate-300/30",   // 2º Prata
    "bg-amber-600 text-amber-100 ring-amber-600/30"    // 3º Bronze
  ];
  const activeRankColor = isTop ? rankColors[index] : "";

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault(); 
    e.stopPropagation();

    if (isLiked) return; 

    // UI Optimistic
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);

    // Salva no banco
    await toggleLikeAction(activity.id);
  }

  return (
    <div className={`group h-full flex flex-col relative transition-all duration-300 ${isTop ? 'scale-[1.02] z-10' : 'hover:-translate-y-1'}`}>
      
      {/* 🏆 MEDALHA TOP 3 */}
      {isTop && (
        <div className={`absolute -top-4 -right-4 z-20 font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform rotate-12 animate-in zoom-in ${activeRankColor}`}>
          <Trophy size={14} className="fill-current" />
          <span className="text-xs">TOP {index + 1}</span>
        </div>
      )}

      <article className={`bg-white rounded-2xl p-5 border shadow-sm h-full flex flex-col relative transition-all
        ${isTop ? `border-transparent shadow-xl ring-4 ${activeRankColor.split(' ')[2]}` : 'border-slate-200 hover:shadow-lg'}
      `}>
        
        {/* Link Principal */}
        <Link href={`/atividade/${activity.id}`} className="flex-grow flex flex-col">
          
          {/* Cabeçalho: Autor */}
          {activity.authorName && (
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0 text-indigo-600 font-bold text-xs">
                {activity.authorPhoto ? (
                  <img src={activity.authorPhoto} alt={activity.authorName} className="h-full w-full object-cover" />
                ) : (
                  activity.authorName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-700 truncate">{activity.authorName}</span>
                {activity.instagramHandle && (
                  <span className="text-[10px] text-slate-400 truncate">@{activity.instagramHandle.replace('@', '')}</span>
                )}
              </div>
            </div>
          )}

          {/* Tags e Data */}
          <div className="flex justify-between items-start mb-3 gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide truncate max-w-[70%]
              ${isTop ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}
            `}>
              {activity.tema}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <Clock size={10} />
              {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Título e Conteúdo */}
          <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {activity.target}
          </h3>
          <div className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">
            {activity.content.replace(/\[.*?\]/g, "").trim()}
          </div>
        </Link>

        {/* 👇 BARRA DE AÇÕES (Rodapé) 👇 */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          
          {/* Botão Like */}
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors
              ${isLiked ? 'text-pink-600 bg-pink-50' : 'text-slate-400 hover:text-pink-500 hover:bg-slate-50'}
            `}
          >
            <Heart 
              size={18} 
              className={`transition-transform duration-300 ${isLiked ? 'fill-pink-600 scale-110' : ''} ${isAnimating ? 'animate-bounce' : ''}`} 
            />
            <span className="text-xs font-bold min-w-[1ch]">{likes > 0 ? likes : ''}</span>
          </button>

          {/* Gerador de Post (Passando o objeto activity corretamente) */}
          <div className="flex-shrink-0 w-28 sm:w-32">
             <InstagramGenerator activity={activity} />
          </div>

          {/* Seta Ver Mais */}
          <Link 
            href={`/atividade/${activity.id}`} 
            className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
            title="Ver detalhes"
          >
             <ArrowRight size={20} />
          </Link>

        </div>
      </article>
    </div>
  );
}