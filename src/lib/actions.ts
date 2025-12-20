// src/lib/actions.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// 1. SCHEMA DE VALIDAÇÃO (Regras de Negócio)
const ActivitySchema = z.object({
  idade: z.string().min(1, "A idade/série é obrigatória."),
  tema: z.string().min(3, "O tema deve ter pelo menos 3 caracteres."),
  materiais: z.string().optional().default(""),
  tipoIdade: z.enum(["idade", "serie"]),
});

// Tipagem do retorno para uso no useFormState
export type FormState = {
  success: boolean;
  data?: string; // O texto gerado pela IA (sucesso)
  error?: string; // Mensagem de erro (validação ou servidor)
};

// 2. INSTANCIAÇÃO DA IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Server Action para gerar atividades lúdicas.
 * @param prevState - Estado anterior do formulário.
 * @param formData - Dados enviados do formulário.
 */
export async function generateActivities(
  formData: FormData
): Promise<FormState> {
  try {
    // 3. COLETA E VALIDAÇÃO DOS DADOS
    const rawData = {
      idade: formData.get("idade"),
      tema: formData.get("tema"),
      materiais: formData.get("materiais"),
      tipoIdade: formData.get("tipoIdade"),
    };

    const validation = ActivitySchema.safeParse(rawData);

    if (!validation.success) {
      // Retorna o primeiro erro de validação (melhor UX)
      const errorMsg = validation.error.issues[0].message;
      return { success: false, error: errorMsg };
    }

    const { idade, tema, materiais, tipoIdade } = validation.data;
    const formattedIdade = `${idade} (${
      tipoIdade === "idade" ? "anos" : "série"
    })`;

    // 4. PROMPT DA IA (Mesma lógica robusta)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



   const prompt = `
Você é a Brinca-AI, a assistente mais fofa das professoras brasileiras.

Crie EXATAMENTE 2 atividades lúdicas para crianças de ${idade}, com o tema "${tema}".

${materiais.trim() ? `Use SOMENTE estes materiais que a professora tem: ${materiais.trim()}. Não invente nada fora dessa lista.` : "Use apenas materiais simples e baratos que toda escola brasileira tem (papel, cola, tesoura sem ponta, EVA, cartolina, garrafa pet, caixa de papelão, etc)."}
Na ausência de materiais específicos, sugira alternativas criativas usando itens comuns encontrados em casa ou na escola.

Cada atividade deve seguir estas
REGRAS OBRIGATÓRIAS:
1. Não use nenhuma saudação inicial (como "Olá professora!" ou "Aqui estão DUAS atividades...").
2. Depois da saudação, coloque uma linha em branco.
3. Para CADA atividade (incluindo a SEGUNDA), comece EXATAMENTE com ✨ no início da linha do título.
4. Use este formato estruturado para AMBAS atividades (sem mudar nada na ordem ou nos dois pontos):

✨ TÍTULO DA BRINCADEIRA (inclua um título BEM criativo e divertido, com emojis, NUNCA pule essa linha)
Objetivo pedagógico: 
Idade/Turma ideal: ${idade}
Duração: 
Materiais necessários: 
Passo a passo:
Variação (opcional):

5. Separe as DUAS atividades com UMA LINHA EM BRANCO EXATA.
6. Não coloque nenhum texto depois da segunda atividade.
7. Garanta que haja titulo nas DUAS atividades.

FAÇA AGORA:`;


    // 5. CHAMADA DA IA
    const result = await model.generateContent(prompt);
    const texto = result.response.text();

    return { success: true, data: texto };
  } catch (error) {
    console.error("ERRO NA SERVER ACTION:", error);
    return {
      success: false,
      error: "Ocorreu um erro interno no servidor ao tentar gerar as atividades. Tente novamente.",
    };
  }
}