import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para o Início
      </Link>

      <section className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
            <FileText size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Termos de Uso</h1>
        </div>

        <div className="prose prose-slate prose-blue max-w-none space-y-6 text-slate-600 font-medium leading-relaxed">
          <p>
            Ao acessar o site <strong>Brinca-AI</strong>, você concorda em cumprir estes termos de serviço e todas as leis aplicáveis.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">1. Licença de Uso</h2>
          <p>
            O conteúdo gerado pela IA (atividades e planos de aula) é para seu uso pessoal e profissional em sala de aula. Você tem o direito de baixar, imprimir e distribuir para seus alunos.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">2. Isenção de Responsabilidade</h2>
          <p>
            As atividades são geradas por Inteligência Artificial. Embora busquemos a melhor qualidade, o Brinca-AI não garante que o conteúdo esteja 100% livre de imprecisões. É responsabilidade do educador revisar a adequação da atividade antes da aplicação.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">3. Limitações</h2>
          <p>
            Em nenhum caso o Brinca-AI será responsável por danos decorrentes do uso ou da incapacidade de usar as sugestões de atividades fornecidas.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">4. Modificações</h2>
          <p>
            O Brinca-AI pode revisar estes termos de serviço a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos.
          </p>
        </div>
      </section>
    </div>
  );
}