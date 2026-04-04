/**
 * Configurações gerais (equivalente a GET/PATCH /api/settings).
 */
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_SITE_SETTINGS,
  mergeSiteSettings,
  type SiteSettingsPayload,
} from "@/lib/cms-defaults";

function rowToPayload(row: {
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  youtube: string | null;
  phone: string | null;
  primary_color: string | null;
  contact_headline: string | null;
  contact_intro: string | null;
}): SiteSettingsPayload {
  return mergeSiteSettings({
    whatsapp: row.whatsapp ?? undefined,
    email: row.email ?? undefined,
    instagram: row.instagram ?? undefined,
    youtube: row.youtube ?? undefined,
    phone: row.phone ?? undefined,
    primaryColor: row.primary_color ?? undefined,
    contactHeadline: row.contact_headline ?? undefined,
    contactIntro: row.contact_intro ?? undefined,
  });
}

export async function fetchSiteSettings(): Promise<SiteSettingsPayload> {
  if (!supabase) return { ...DEFAULT_SITE_SETTINGS };
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  if (!data) return { ...DEFAULT_SITE_SETTINGS };
  return rowToPayload(data);
}

export async function saveSiteSettings(payload: SiteSettingsPayload): Promise<void> {
  const client = supabase;
  if (!client) throw new Error("Supabase não configurado");
  const { error } = await client.from("site_settings").upsert(
    {
      id: 1,
      whatsapp: payload.whatsapp,
      email: payload.email,
      instagram: payload.instagram,
      youtube: payload.youtube || null,
      phone: payload.phone,
      primary_color: payload.primaryColor,
      contact_headline: payload.contactHeadline,
      contact_intro: payload.contactIntro,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}
