/**
 * Tipos compartilhados do portfólio — preparados para futura API /admin.
 */
export type ProjectMediaItem =
  | { id: string; type: "image"; src: string; alt?: string }
  | { id: string; type: "video"; src: string; poster?: string }
  | { id: string; type: "video_embed"; src: string; title?: string };

export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Ordem no CMS (opcional no front). */
  sortOrder?: number;
  published?: boolean;
  /** Miniatura do card na grade (URL ou import Vite). */
  coverImage: string;
  /** Galeria no detalhe: imagens, vídeo em arquivo ou embed. */
  media: ProjectMediaItem[];
};
