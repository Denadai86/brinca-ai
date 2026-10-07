"use client"; // 1. Obrigatório ser a primeira linha
//src/app/dashboard/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Melhor que window.location
import { Loader2, FolderOpen } from "lucide-react";

// Imports do projeto
import { useAuth } from "@/auth/AuthProvider";
import { getUserActivities } from "@/lib/actions";
import { ActivityCard } from "@/components/ActivityCard";
import { ActivityData } from "@/types/gemini"; // Se você criou o arquivo de tipos, senão use 'any'

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Estado local
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // 1. Se carregou o auth e não tem usuário, chuta para home
    if (!loading && !user) {
      router.push("/"); 
      return;
    }

    // 2. Se tem usuário, busca os dados
    if (user) {
      // O servidor identifica o dono pelo ID token (antes aceitava qualquer uid).
      user
        .getIdToken()
        .then((token) => getUserActivities(token))
        .then((res) => {
          if (res.success && res.data) {
            setActivities(res.data);
          }
        })
        .catch((err) => console.error("Erro ao carregar o painel:", err))
        .finally(() => setLoadingData(false));
    }
  }, [user, loading, router]);

  // Renderização de Loading (Autenticação ou Dados)
  if (loading || loadingData) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={40} />
      </main>
    );
  }

  // Se não estiver logado (e o useEffect ainda não redirecionou), retorna null para não piscar tela
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Cabeçalho do Dashboard */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Meu Painel 📂</h1>
            <p className="text-slate-500">Suas contribuições e atividades salvas.</p>
          </div>
          <Link 
            href="/" 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <span>+</span> Nova Atividade
          </Link>
        </div>

        {/* Lista de Atividades */}
        {activities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FolderOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600">Nenhuma atividade encontrada</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Você ainda não criou ou salvou nenhuma atividade. 
              Que tal criar a primeira agora?
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
