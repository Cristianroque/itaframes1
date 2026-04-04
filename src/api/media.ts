/**
 * Upload de arquivos (equivalente a POST /api/media).
 * Armazena em Supabase Storage bucket `site-media`.
 */
import { requireSupabase } from "@/integrations/supabase/client";

const BUCKET = "site-media";

export async function uploadMediaFile(file: File, folder = "uploads"): Promise<string> {
  const client = requireSupabase();
  const safeName = file.name.replace(/\s+/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await client.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
