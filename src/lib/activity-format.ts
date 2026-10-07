// src/lib/activity-format.ts
//
// Funções puras (sem "server-only"): usadas pelo servidor (gemini.ts / actions.ts)
// e pelos componentes. É a ÚNICA fonte do formato com tags ([TITULO], [MATERIAIS]...)
// que /atividade/[id], ActivityCard e a vitrine já sabem ler.

export type ActivityCategory = "maternal" | "pre" | "fundamental";

export interface GeneratedActivity {
  titulo: string;
  motivacional: string;
  materiais: string[];
  pedagogico: string;
  passos: string[];
  categoria: ActivityCategory;
  /** Texto serializado com tags. É o que vai para o Firestore. */
  content: string;
}

/**
 * Remove colchetes e quebras de linha: os componentes usam /\[.*?\]/ para tirar as tags,
 * então um colchete vindo do modelo apagaria texto real (ou fabricaria uma tag falsa).
 */
export function stripBrackets(text: string): string {
  return text.replace(/[\[\]]/g, "").replace(/\s+/g, " ").trim();
}

export function serializeActivity(a: Omit<GeneratedActivity, "content">): string {
  return [
    `[TITULO] ${a.titulo}`,
    `[MOTIVACIONAL] ${a.motivacional}`,
    `[MATERIAIS]`,
    ...a.materiais.map((m) => `- ${m}`),
    `[PEDAGOGICO]`,
    a.pedagogico,
    `[PASSO_A_PASSO]`,
    ...a.passos.map((p, i) => `${i + 1}. ${p}`),
  ].join("\n");
}

/** Título da atividade (linha [TITULO]); null se o conteúdo não tiver a tag. */
export function extractTitle(content: string): string | null {
  const line = content.split("\n").find((l) => l.includes("[TITULO]"));
  if (!line) return null;
  const title = line.replace("[TITULO]", "").trim();
  return title || null;
}

/** Texto corrido para pré-visualização em cards: sem a linha do título e sem as tags. */
export function previewText(content: string): string {
  return content
    .split("\n")
    .filter((l) => !l.includes("[TITULO]"))
    .join("\n")
    .replace(/\[.*?\]/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// ---------------------------------------------------------------------------------
// Leitura do texto com tags -> estrutura (usada pelo gerador de post do Instagram)
// ---------------------------------------------------------------------------------
export interface ParsedActivity {
  titulo: string;
  motivacional: string;
  materiais: string[];
  pedagogico: string;
  passos: string[];
}

type Section = "titulo" | "motivacional" | "materiais" | "pedagogico" | "passos";

const SECTION_BY_TAG: Record<string, Section> = {
  TITULO: "titulo",
  MOTIVACIONAL: "motivacional",
  MATERIAIS: "materiais",
  PEDAGOGICO: "pedagogico",
  PASSO_A_PASSO: "passos",
};

/**
 * Converte o `content` salvo ([TITULO], [MATERIAIS]...) em campos separados.
 * Funciona com as atividades novas (JSON) e com as antigas do Firestore.
 */
export function parseActivity(content: string): ParsedActivity {
  const out: ParsedActivity = {
    titulo: "",
    motivacional: "",
    materiais: [],
    pedagogico: "",
    passos: [],
  };

  const add = (section: Section, text: string) => {
    if (section === "materiais") {
      const item = text.replace(/^[-*•]\s*/, "").trim();
      if (item) out.materiais.push(item);
    } else if (section === "passos") {
      const step = text.replace(/^(\d+\s*[.)]|[-*•])\s*/, "").trim();
      if (step) out.passos.push(step);
    } else {
      out[section] = out[section] ? `${out[section]} ${text}` : text;
    }
  };

  let section: Section | null = null;
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    const tag = line.match(/^\[([A-Z_]+)\]\s*(.*)$/);
    if (tag && SECTION_BY_TAG[tag[1]]) {
      section = SECTION_BY_TAG[tag[1]];
      const rest = tag[2].trim();
      // texto na mesma linha da tag (ignora placeholders como "(Bullet points)")
      if (rest && !/^\(.*\)$/.test(rest)) add(section, rest);
      continue;
    }
    if (section) add(section, line);
  }

  return out;
}
