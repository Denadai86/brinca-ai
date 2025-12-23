import { getPublicActivities } from "@/lib/actions";
import { Sparkles, Clock, BookOpen } from "lucide-react";

export async function ActivityFeed() {
  // O componente é "async" porque busca dados no servidor (Server Component)
  const { data: activities } = await getPublicActivities();

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <Sparkles className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>A vitrine ainda está vazia. Seja a primeira a criar! ✨</p>
      </div>
    );
  }

  return (
    <section className="mt-16 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-800">Vitrine da Comunidade</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity: any) => (
          <div 
            key={activity.id} 
            className="group relative bg-white rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            {/* Cabeçalho do Card */}
            <div className="flex justify-between items-start mb-4">
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {activity.tema}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} />
                {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>

            {/* Conteúdo (Resumo) */}
            <div className="space-y-3 mb-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <BookOpen size={16} className="text-pink-500" />
                Atividade para {activity.target}
              </h3>
              
              <div className="text-sm text-slate-500 line-clamp-4 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {/* Removemos quebras de linha excessivas para o preview */}
                {activity.content.slice(0, 150)}...
              </div>
            </div>

            {/* Botão de Ver Completo (Pode ser um Modal futuramente) */}
            <button className="w-full py-2 text-sm font-bold text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
              Ver Completo
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}