export interface GeminiModelRaw {
  name: string;
  version: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
}

export interface GeminiListResponse {
  models: GeminiModelRaw[];
}

export interface GenerationResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export interface ActivityData {
  id?: string;
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