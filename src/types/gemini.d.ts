import type { GeneratedActivity } from "@/lib/activity-format";

export interface GenerationResponse {
  success: boolean;
  /** Atividades geradas e validadas (já com o texto serializado em `content`). */
  activities?: GeneratedActivity[];
  /** Metadados para exibir/compartilhar os cards. */
  tema?: string;
  target?: string;
  error?: string;
}

export interface ActivityData {
  id: string;
  tema: string;
  target: string; // Idade/Turma
  content: string;
  categoria: string;
  createdAt: string | Date; // Flexibilidade para serialização
  likes: number;
  authorName?: string;
  authorPhoto?: string;
  instagramHandle?: string;
}
