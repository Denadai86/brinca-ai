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

export type FormState = {
  success: boolean;
  data?: string;
  error?: string;
};

// 2. INSTANCIAÇÃO DA IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
      const errorMsg = validation.error.issues[0].message;
      return { success: false, error: errorMsg };
    }

    const { idade, tema, materiais, tipoIdade } = validation.data;
    const formattedIdade = `${idade} (${tipoIdade === "idade" ? "anos" : "série/ciclo"})`;

    // 4. CONFIGURAÇÃO DO MODELO
    // Utilizando gemini-1.5-flash para velocidade e custo-benefício em micro-SaaS
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
ATUE COMO: Uma pedagoga sênior especialista em Educação Infantil e Ensino Fundamental I, com foco em aprendizagem lúdica e afetiva.

SUA TAREFA: Criar exatamente 2 atividades pedagógicas originais para crianças de ${formattedIdade}, com o tema "${tema}".

REGRAS CRÍTICAS DE SEGURANÇA (SYSTEM SAFETY):
1. Se o tema "${tema}" for desrespeitoso, violento, sexual, político ou inadequado para crianças, IGNORE-O totalmente.
2. Em caso de bloqueio, gere atividades sobre "Empatia e Amizade".
3. Proibido sugerir materiais cortantes, fogo ou qualquer risco físico.

MATERIAIS DISPONÍVEIS (Considere estes primeiro):
${materiais.trim() ? materiais : "Papel, lápis de cor, cola e materiais recicláveis simples."}

FORMATO DE RESPOSTA (OBRIGATÓRIO):
Para cada atividade, use EXATAMENTE a estrutura abaixo. Inicie cada atividade com o emoji ✨.
Use as tags [TAG] para delimitar cada seção, conforme o exemplo:

✨
[TITULO] Nome Criativo da Atividade
[IDADE] ${formattedIdade}
[MOTIVACIONAL] Uma frase acolhedora e temática inspirada em personagens queridos (Disney, Pixar, Stitch, etc) que motive o professor.
[MATERIAIS] Lista organizada de materiais.
[PEDAGOGICO] Objetivo de aprendizagem alinhado às competências da BNCC.
[PASSO_A_PASSO] Guia detalhado de como executar a brincadeira.

Separe a primeira atividade da segunda com o caractere ✨.
Não use negrito (**) ou outras marcações Markdown fora das tags.
`;

    // 5. CHAMADA DA IA
    const result = await model.generateContent(prompt);
    const texto = result.response.text();

    if (!texto) {
      throw new Error("A IA retornou uma resposta vazia.");
    }

    return { success: true, data: texto };
  } catch (error) {
    console.error("ERRO NA SERVER ACTION:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao gerar as atividades. Verifique sua conexão e tente novamente.",
    };
  }
}