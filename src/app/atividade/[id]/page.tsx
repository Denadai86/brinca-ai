import { db } from "@/lib/firebase-admin";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import { InstagramGenerator } from "@/components/InstagramGenerator";

// Definição da interface para garantir tipagem correta
interface ActivityData {
  id: string;
  tema: string;
  target: string;
  content: string;
  categoria: string;
  likes: number;
  authorName: string | null;
  authorPhoto: string | null;
  instagramHandle: string | null;
  createdAt: string;
}

async function getActivity(id: string): Promise<ActivityData | null> {
  try {
    const doc = await db.collection("public_activities").doc(id).get();
    
    if (!doc.exists) return null;

    const rawData = doc.data();
    if (!rawData) return null;

    // ✅ Limpeza e Serialização: Transformamos o documento do Firebase em um objeto plano (POJO)
    // Isso evita o erro "Only plain objects can be passed to Client Components"
    return {
      id: doc.id,
      tema: rawData.tema || "",
      target: rawData.target || "",
      content: rawData.content || "",
      categoria: rawData.categoria || "",
      likes: rawData.likes || 0,
      authorName: rawData.authorName || null,
      authorPhoto: rawData.authorPhoto || null,
      instagramHandle: rawData.instagramHandle || null,
      // Converte o Timestamp do Firebase para string ISO
      createdAt: rawData.createdAt?.toDate?.().toISOString() || new Date().toISOString()
    };
  } catch (error) {
    console.error("Erro ao buscar atividade:", error);
    return null;
  }
}

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = await getActivity(params.id);

  if (!activity) return notFound();

  // Formatação do Texto baseada nas tags geradas pela IA
  const formattedContent = activity.content.split("\n").map((line: string, i: number) => {
    if (line.includes("[TITULO]")) 
      return <h1 key={i} className="text-3xl font-bold text-purple-800 mb-6 mt-2 print:text-black print:text-2xl">{line.replace("[TITULO]", "")}</h1>;
    if (line.includes("[MOTIVACIONAL]")) 
      return <div key={i} className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400 italic text-slate-700 my-6 print:border-l-2 print:border-slate-400 print:bg-slate-50 print:text-sm">{line.replace("[MOTIVACIONAL]", "")}</div>;
    if (line.includes("[MATERIAIS]")) 
      return <h3 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-3 flex items-center gap-2 print:mt-4"><div className="w-2 h-8 bg-pink-500 rounded-full print:hidden"/> Materiais Necessários</h3>;
    if (line.includes("[PASSO_A_PASSO]")) 
      return <h3 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-3 flex items-center gap-2 print:mt-4"><div className="w-2 h-8 bg-purple-500 rounded-full print:hidden"/> Passo a Passo</h3>;
    if (line.includes("[PEDAGOGICO]")) 
      return <h3 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-3 flex items-center gap-2 print:mt-4"><div className="w-2 h-8 bg-blue-500 rounded-full print:hidden"/> Objetivo Pedagógico</h3>;
    
    if (line.trim() === "") return <br key={i} />;
    const cleanLine = line.replace(/\[.*?\]/, "");
    return <p key={i} className="text-slate-600 leading-relaxed mb-2 text-lg print:text-base print:text-black">{cleanLine}</p>;
  });

  return (
    <main className="min-h-screen bg-slate-50 py-8 md:py-12 px-4 print:bg-white print:p-0">
      
      {/* Botão Voltar */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <Link href="/vitrine" className="text-slate-500 hover:text-purple-600 flex items-center gap-2 font-medium transition-colors">
          <ArrowLeft size={20} /> Voltar para a Vitrine
        </Link>
      </div>

      {/* A FOLHA DE PAPEL */}
      <article className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 print:shadow-none print:border-none print:rounded-none print:max-w-none">
        
        {/* Cabeçalho Visual */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white print:bg-none print:p-0 print:text-black print:mb-4 print:border-b print:border-slate-300">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="w-full">
              {/* Tags */}
              <div className="flex gap-2 mb-4 print:hidden">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {activity.tema}
                </span>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {activity.target}
                </span>
              </div>

              {/* Título Print */}
              <div className="hidden print:block text-xs text-slate-400 mb-2 uppercase tracking-wide">
                Atividade Gerada por IA • Brinca-AI
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2 hidden print:block">
                Atividade: {activity.tema} ({activity.target})
              </h1>
              
              {/* Nome do Autor */}
              {activity.authorName && (
                <div className="flex items-center gap-2 mt-4 bg-white/10 w-fit px-3 py-1.5 rounded-full print:hidden">
                    <span className="text-xs font-bold text-white/90">Criado por {activity.authorName}</span>
                    {activity.instagramHandle && <span className="text-[10px] text-white/60">@{activity.instagramHandle}</span>}
                </div>
              )}
            </div>

            {/* AÇÕES (Gerar Post + Imprimir) */}
            <div className="flex flex-wrap gap-2 print:hidden shrink-0 items-center">
               {/* Passamos o objeto activity limpo para o componente cliente */}
               <InstagramGenerator activity={activity} />
               <PrintButton />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-white/80 text-sm print:hidden">
            <Calendar size={14} /> Gerado em {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-8 md:p-12 print:p-0">
          <div className="prose prose-lg max-w-none text-slate-600 print:prose-base">
            {formattedContent}
          </div>

          {/* Rodapé do Print */}
          <div className="hidden print:flex mt-12 pt-8 border-t border-slate-300 justify-between text-xs text-slate-400">
            <span>brinca-ai.acaoleve.com</span>
            <span>Feito com 💜 para educadores</span>
          </div>
        </div>
      </article>
    </main>
  );
}