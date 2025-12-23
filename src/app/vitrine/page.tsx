import { getPublicActivities } from "@/lib/actions";
import { Sparkles } from "lucide-react";
import { ActivityCard } from "@/components/ActivityCard";

export const metadata = {
  title: "Vitrine de Atividades | Brinca-AI",
  description: "Inspire-se com atividades criadas por outras professoras.",
};

export default async function VitrinePage() {
  // Lembre-se de mudar o .limit() lá no actions.ts para 15 ou 30!
  const { data: activities } = await getPublicActivities();

  // 🛠️ CORREÇÃO AQUI: Definimos o tipo explícito 'any[]'
  let displayList: any[] = [];

  if (activities && activities.length > 0) {
    // Separa os Top 3 (Ficam fixos no topo)
    const top3 = activities.slice(0, 3);
    
    // Pega o resto
    let rest = activities.slice(3);

    // Algoritmo de Fisher-Yates para embaralhar o resto
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    // Junta tudo de volta
    displayList = [...top3, ...rest];
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Vitrine da Comunidade 🌟
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Explore atividades, deixe seu like ❤️ e inspire-se.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        {!displayList || displayList.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Nenhuma atividade encontrada...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((activity: any, index: number) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}