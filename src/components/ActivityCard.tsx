"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Heart, Trophy } from "lucide-react";
import { InstagramGenerator } from "@/components/InstagramGenerator";
import { setLikeAction } from "@/lib/actions";
import { useAuth } from "@/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { extractTitle, previewText } from "@/lib/activity-format";

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
  /** Posição no pódio (1–3). Só quem recebe `rank` ganha a medalha de TOP. */
  rank?: number;
  /** @deprecated não é mais usado (antes, os 3 primeiros de QUALQUER lista ganhavam medalha). */
  index?: number;
}

export function ActivityCard({ activity, rank }: ActivityCardProps) {
  const { login } = useAuth();
  const [likes, setLikes] = useState(activity.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // Medalha só no pódio (a vitrine passa rank 1–3). Antes: index < 3 em qualquer lista.
  const isTop = typeof rank === "number" && rank >= 1 && rank <= 3;
  const rankColors = [
    "bg-yellow-400 text-yellow-900 ring-yellow-400/30", // 1º Ouro
    "bg-slate-300 text-slate-800 ring-slate-300/30",   // 2º Prata
    "bg-amber-600 text-amber-100 ring-amber-600/30"    // 3º Bronze
  ];
  const activeRankColor = isTop ? rankColors[rank! - 1] : "";

  const title = extractTitle(activity.content);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isBusy) return;
    setIsBusy(true);

    try {
      // Curtir exige login: o servidor confere o token e guarda 1 curtida por usuário.
      let current = auth.currentUser;
      if (!current) {
        await login(); // abre o popup do Google (dentro do clique, então não é bloqueado)
        current = auth.currentUser;
      }
      if (!current) return;

      const token = await current.getIdToken();
      const res = await setLikeAction(token, activity.id, !isLiked);

      if (res.success) {
        setLikes(res.likes);
        setIsLiked(res.liked);
        if (res.liked) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
        }
      }
    } catch (err) {
      console.error("Erro ao curtir:", err); // ex.: popup de login fechado
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className={`group h-full flex flex-col relative transition-all duration-300 ${isTop ? 'scale-[1.02] z-10' : 'hover:-translate-y-1'}`}>
      
      {/* 🏆 MEDALHA TOP 3 */}
      {isTop && (
        <div className={`absolute -top-4 -right-4 z-20 font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform rotate-12 animate-in zoom-in ${activeRankColor}`}>
          <Trophy size={14} className="fill-current" />
          <span className="text-xs">TOP {rank}</span>
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
          <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {title ?? activity.target}
          </h3>
          {title && (
            <span className="text-xs text-slate-400 mb-2 truncate">{activity.target}</span>
          )}
          <div className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">
            {previewText(activity.content)}
          </div>
        </Link>

        {/* 👇 BARRA DE AÇÕES (Rodapé) 👇 */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          
          {/* Botão Like */}
          <button 
            onClick={handleLike}
            disabled={isBusy}
            aria-pressed={isLiked}
            aria-label={isLiked ? "Remover curtida" : "Curtir atividade"}
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