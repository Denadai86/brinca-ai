import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
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
          <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Política de Privacidade</h1>
        </div>

        <div className="prose prose-slate prose-purple max-w-none space-y-6 text-slate-600 font-medium leading-relaxed">
          <p>
            A sua privacidade é importante para nós. É política do <strong>Brinca-AI</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">1. Coleta de Informações</h2>
          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço (como a geração de atividades personalizadas). Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">2. Uso de Dados e IA</h2>
          <p>
            Os dados inseridos no formulário (idade, tema e materiais) são enviados à API do Google Gemini para a geração do conteúdo lúdico. Não armazenamos esses dados para outros fins que não a exibição imediata para você.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">3. Cookies e Telemetria</h2>
          <p>
            Utilizamos o Google Tag Manager para entender o fluxo de usuários e melhorar a experiência da plataforma. Estes dados são anonimizados.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">4. Retenção de Dados</h2>
          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos.
          </p>
        </div>
      </section>
    </div>
  );
}