import { getPublicActivities } from "@/lib/actions";
import { Sparkles, Trophy } from "lucide-react";
import { ActivityCard } from "@/components/ActivityCard";

export const metadata = {
  title: "Vitrine de Atividades | Brinca-AI",
  description: "As melhores atividades da comunidade.",
};

export default async function VitrinePage() {
  // 1. Busca os TOP 3 mais curtidos (Ouro, Prata, Bronze)
  const { data: topActivities } = await getPublicActivities("likes", 3);
  
  // 2. Busca o Feed Recente (para novidades) - Pega 12
  const { data: recentActivities } = await getPublicActivities("createdAt", 12);

  // Remove duplicatas (caso um top 3 também esteja nos recentes)
  const topIds = new Set(topActivities?.map((a: any) => a.id));
  const uniqueRecent = recentActivities?.filter((a: any) => !topIds.has(a.id)) || [];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Vitrine da Comunidade 🌟
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            As atividades mais amadas pelas professoras.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        
        {/* SEÇÃO TOP 3 (PODIO) */}
        {topActivities && topActivities.length > 0 && (
          <div className="mb-16">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800 mb-6">
              <Trophy className="text-yellow-500 fill-yellow-500" />
              Destaques da Comunidade
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topActivities.map((activity: any, index: number) => (
                <div key={activity.id} className="relative">
                   {/* Badge de Pódio */}
                   <div className="absolute -top-4 -left-4 z-10 bg-yellow-400 text-yellow-900 font-black w-10 h-10 flex items-center justify-center rounded-full shadow-lg border-2 border-white text-lg transform -rotate-12">
                     #{index + 1}
                   </div>
                   <ActivityCard activity={activity} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-700 mb-6 border-l-4 border-indigo-500 pl-3">
          Chegaram agora
        </h2>

        {!uniqueRecent || uniqueRecent.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Nenhuma atividade recente...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniqueRecent.map((activity: any, index: number) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}