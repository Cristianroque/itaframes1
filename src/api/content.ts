/**
 * Conteúdo editorial (equivalente a GET/PATCH /api/content).
 */
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { AboutPayload, HeroPayload } from "@/lib/cms-defaults";
import { mergeAboutPayload, mergeHeroPayload } from "@/lib/cms-defaults";

export async function fetchHeroPayload(): Promise<HeroPayload> {
  if (!supabase) return mergeHeroPayload(null);
  const { data, error } = await supabase.from("site_content").select("value").eq("key", "hero").maybeSingle();
  if (error) throw error;
  return mergeHeroPayload(data?.value ?? null);
}

export async function saveHeroPayload(payload: HeroPayload): Promise<void> {
  const client = supabase;
  if (!client) throw new Error("Supabase não configurado");
  const { error } = await client.from("site_content").upsert(
    {
      key: "hero",
      value: payload as unknown as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
}

export async function fetchAboutPayload(): Promise<AboutPayload> {
  if (!supabase) return mergeAboutPayload(null);
  const { data, error } = await supabase.from("site_content").select("value").eq("key", "about").maybeSingle();
  if (error) throw error;
  return mergeAboutPayload(data?.value ?? null);
}

export async function saveAboutPayload(payload: AboutPayload): Promise<void> {
  const client = supabase;
  if (!client) throw new Error("Supabase não configurado");
  const { error } = await client.from("site_content").upsert(
    {
      key: "about",
      value: payload as unknown as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
}
