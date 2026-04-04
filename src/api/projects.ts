/**
 * Camada de dados de projetos (equivalente a GET/POST/PATCH/DELETE /api/projects).
 * Backend: Supabase Postgres + RLS.
 */
import { supabase } from "@/integrations/supabase/client";
import type { PortfolioProject, ProjectMediaItem } from "@/types/portfolio";

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  cover_image_url: string | null;
  sort_order: number;
  published: boolean;
  project_media?: MediaRow[] | null;
};

type MediaRow = {
  id: string;
  project_id: string;
  type: "image" | "video" | "video_embed";
  url: string;
  alt: string | null;
  poster_url: string | null;
  sort_order: number;
};

function rowToMedia(m: MediaRow): ProjectMediaItem {
  if (m.type === "image") {
    return { id: m.id, type: "image", src: m.url, alt: m.alt ?? undefined };
  }
  if (m.type === "video") {
    return { id: m.id, type: "video", src: m.url, poster: m.poster_url ?? undefined };
  }
  return { id: m.id, type: "video_embed", src: m.url, title: m.alt ?? undefined };
}

export function mapProjectRow(row: ProjectRow): PortfolioProject {
  const media = (row.project_media ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(rowToMedia);

  const cover =
    row.cover_image_url?.trim() ||
    media.find((x) => x.type === "image")?.src ||
    media.find((x) => x.type === "video")?.poster ||
    "";

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    sortOrder: row.sort_order,
    published: row.published,
    coverImage: cover,
    media: media.length ? media : cover ? [{ id: `${row.id}-cover`, type: "image" as const, src: cover, alt: row.title }] : [],
  };
}

const selectWithMedia = "*, project_media(*)";

export async function fetchPublishedProjects(): Promise<PortfolioProject[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select(selectWithMedia)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as ProjectRow[]).map(mapProjectRow);
}

export async function fetchAllProjectsForAdmin(): Promise<PortfolioProject[]> {
  const client = supabase;
  if (!client) return [];
  const { data, error } = await client.from("projects").select(selectWithMedia).order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as ProjectRow[]).map(mapProjectRow);
}

export type ProjectWriteInput = {
  title: string;
  description: string;
  category: string;
  cover_image_url: string | null;
  published: boolean;
  sort_order: number;
  media: { type: "image" | "video" | "video_embed"; url: string; alt?: string; poster_url?: string | null }[];
};

export async function createProject(input: ProjectWriteInput): Promise<string> {
  const client = supabase;
  if (!client) throw new Error("Supabase não configurado");

  const { data: proj, error: e1 } = await client
    .from("projects")
    .insert({
      title: input.title,
      description: input.description,
      category: input.category,
      cover_image_url: input.cover_image_url,
      published: input.published,
      sort_order: input.sort_order,
    })
    .select("id")
    .single();

  if (e1) throw e1;
  const projectId = proj.id;

  if (input.media.length) {
    const { error: e2 } = await client.from("project_media").insert(
      input.media.map((m, i) => ({
        project_id: projectId,
        type: m.type,
        url: m.url,
        alt: m.alt ?? null,
        poster_url: m.poster_url ?? null,
        sort_order: i,
      })),
    );
    if (e2) throw e2;
  }

  return projectId;
}

export async function updateProject(projectId: string, input: ProjectWriteInput): Promise<void> {
  const client = supabase;
  if (!client) throw new Error("Supabase não configurado");

  const { error: e1 } = await client
    .from("projects")
    .update({
      title: input.title,
      description: input.description,
      category: input.category,
      cover_image_url: input.cover_image_url,
      published: input.published,
      sort_order: input.sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (e1) throw e1;

  const { error: delErr } = await client.from("project_media").delete().eq("project_id", projectId);
  if (delErr) throw delErr;

  if (input.media.length) {
    const { error: insErr } = await client.from("project_media").insert(
      input.media.map((m, i) => ({
        project_id: projectId,
        type: m.type,
        url: m.url,
        alt: m.alt ?? null,
        poster_url: m.poster_url ?? null,
        sort_order: i,
      })),
    );
    if (insErr) throw insErr;
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const client = supabase;
  if (!client) throw new Error("Supabase não configurado");
  const { error } = await client.from("projects").delete().eq("id", projectId);
  if (error) throw error;
}
