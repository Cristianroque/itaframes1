/**
 * Upload direto para Supabase Storage (bucket `site-media`).
 * Projetos: `projects/images/` e `projects/videos/`. Conteúdo: `hero/`, `about/` (inalterado).
 */
import { requireSupabase } from "@/integrations/supabase/client";

const BUCKET = "site-media";

const VIDEO_EXT = /\.(mp4|webm|mov|mkv|avi|m4v|mpeg|mpg|3gp|ogv)$/i;
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|heic|svg|bmp|tiff?)$/i;

export function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  return VIDEO_EXT.test(file.name);
}

export function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_EXT.test(file.name);
}

function sanitizeFileName(name: string): string {
  const s = name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
  return s || "ficheiro";
}

/** Converte erros do Storage em mensagem legível (toast / UI). */
export function formatStorageUploadError(error: unknown): string {
  const m =
    error instanceof Error
      ? error.message
      : error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string"
        ? (error as { message: string }).message
        : "";
  if (m) {
    if (/413|entity too large|payload too large|too large|maximum.*size|file size/i.test(m)) {
      return "O servidor recusou o ficheiro (tamanho). No Supabase, execute migrations/002_storage_large_uploads.sql e confira o plano em Storage.";
    }
    if (/401|403|jwt|not authorized|unauthorized|permission/i.test(m)) {
      return "Sem permissão para enviar. Entre outra vez em /login e tente de novo.";
    }
    if (/network|failed to fetch|timeout|timed out|load failed/i.test(m)) {
      return "Rede instável ou tempo esgotado. Tente outra ligação ou um ficheiro mais pequeno.";
    }
    if (m.trim()) return m;
  }
  return "Erro ao enviar ficheiro.";
}

function guessContentType(file: File): string {
  if (file.type) return file.type;
  if (isVideoFile(file)) return "video/mp4";
  if (isImageFile(file)) return "image/jpeg";
  return "application/octet-stream";
}

export type ProjectUploadSlot = "cover" | "gallery";

/**
 * @param file Ficheiro a enviar
 * @param folderOrSlot `projects` (legacy) ou `hero` / `about` para CMS; ou `{ scope: 'project', slot }` para pastas images/videos
 */
export async function uploadMediaFile(
  file: File,
  folderOrSlot: string | { scope: "project"; slot: ProjectUploadSlot } = "uploads",
): Promise<string> {
  const client = requireSupabase();
  const unique = `${Date.now()}-${sanitizeFileName(file.name)}`;

  let objectPath: string;

  if (typeof folderOrSlot === "object" && folderOrSlot.scope === "project") {
    const sub =
      folderOrSlot.slot === "cover"
        ? isVideoFile(file)
          ? "videos"
          : "images"
        : isVideoFile(file)
          ? "videos"
          : "images";
    objectPath = `projects/${sub}/${unique}`;
  } else {
    const folder = typeof folderOrSlot === "string" ? folderOrSlot : "uploads";
    if (folder === "projects") {
      const sub = isVideoFile(file) ? "videos" : "images";
      objectPath = `projects/${sub}/${unique}`;
    } else {
      objectPath = `${folder}/${unique}`;
    }
  }

  const contentType = guessContentType(file);

  const { error } = await client.storage.from(BUCKET).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });

  if (error) {
    throw new Error(formatStorageUploadError(error));
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}
