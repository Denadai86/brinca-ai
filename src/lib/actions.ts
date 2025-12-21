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
ATUE COMO: Uma pedagoga especialista em Educação Infantil, segura, ética e criativa.

SUA TAREFA: Criar 2 atividades lúdicas para crianças de ${formattedIdade}, com o tema "${tema}".

REGRAS CRÍTICAS DE SEGURANÇA (SYSTEM SAFETY):
1. Se o tema "${tema}" for desrespeitoso, violento, sexual (+18), político, religioso extremista ou inadequado para crianças, IGNORE O TEMA solicitado.
2. Nesse caso de bloqueio, gere atividades genéricas e seguras sobre "Amizade e Cooperação".
3. Jamais gere conteúdo que envolva materiais perigosos (facas, fogo, vidro).

MATERIAIS DISPONÍVEIS:
${materiais.trim() ? materiais : "Materiais escolares simples e baratos (papel, cola, sucata)."}

FORMATO DE RESPOSTA (RIGOROSO):
1. Não use saudações. Comece direto.
2. Use EXATAMENTE o emoji ✨ no início do título de CADA atividade.
3. Separe as duas atividades com uma linha em branco.

ESTRUTURA:
✨ TÍTULO DIVERTIDO
Objetivo: ...
Passo a passo: ...
`;


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