import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { fetchPublishedProjects } from "@/api/projects";
import { fetchAboutPayload, fetchHeroPayload } from "@/api/content";
import { fetchSiteSettings } from "@/api/settings";
import { defaultProjects } from "@/data/projects";
import type { AboutPayload, HeroPayload, SiteSettingsPayload } from "@/lib/cms-defaults";
import { DEFAULT_ABOUT_PAYLOAD, DEFAULT_HERO_PAYLOAD, DEFAULT_SITE_SETTINGS } from "@/lib/cms-defaults";
import type { PortfolioProject } from "@/types/portfolio";

export const cmsQueryKeys = {
  projectsPublished: ["cms", "projects", "published"] as const,
  projectsAdmin: ["cms", "projects", "admin"] as const,
  hero: ["cms", "content", "hero"] as const,
  about: ["cms", "content", "about"] as const,
  settings: ["cms", "settings"] as const,
};

export function usePublishedProjects() {
  return useQuery({
    queryKey: cmsQueryKeys.projectsPublished,
    queryFn: fetchPublishedProjects,
    enabled: isSupabaseConfigured,
    staleTime: 30_000,
    retry: 1,
  });
}

/** Projetos exibidos no site: Supabase quando configurado; senão dados locais. */
export function useSiteProjects(): {
  projects: PortfolioProject[];
  isLoading: boolean;
  isError: boolean;
} {
  const q = usePublishedProjects();
  if (!isSupabaseConfigured) {
    return { projects: defaultProjects, isLoading: false, isError: false };
  }
  if (q.isLoading) {
    return { projects: defaultProjects, isLoading: true, isError: false };
  }
  if (q.isError) {
    return { projects: defaultProjects, isLoading: false, isError: true };
  }
  return { projects: q.data ?? [], isLoading: false, isError: false };
}

export function useHeroContent() {
  return useQuery({
    queryKey: cmsQueryKeys.hero,
    queryFn: fetchHeroPayload,
    enabled: isSupabaseConfigured,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useSiteHero(): { hero: HeroPayload; isLoading: boolean } {
  const q = useHeroContent();
  if (!isSupabaseConfigured) {
    return { hero: { ...DEFAULT_HERO_PAYLOAD }, isLoading: false };
  }
  if (q.isError) {
    return { hero: { ...DEFAULT_HERO_PAYLOAD }, isLoading: false };
  }
  if (q.isPending) {
    return { hero: { ...DEFAULT_HERO_PAYLOAD }, isLoading: true };
  }
  return { hero: q.data ?? { ...DEFAULT_HERO_PAYLOAD }, isLoading: false };
}

export function useAboutContent() {
  return useQuery({
    queryKey: cmsQueryKeys.about,
    queryFn: fetchAboutPayload,
    enabled: isSupabaseConfigured,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useSiteAbout(): { about: AboutPayload; isLoading: boolean } {
  const q = useAboutContent();
  const fallback = {
    ...DEFAULT_ABOUT_PAYLOAD,
    paragraphs: [...DEFAULT_ABOUT_PAYLOAD.paragraphs],
    stats: [...DEFAULT_ABOUT_PAYLOAD.stats],
  };
  if (!isSupabaseConfigured) {
    return { about: fallback, isLoading: false };
  }
  if (q.isError) {
    return { about: fallback, isLoading: false };
  }
  if (q.isPending) {
    return { about: fallback, isLoading: true };
  }
  return { about: q.data ?? fallback, isLoading: false };
}

export function useSettingsContent() {
  return useQuery({
    queryKey: cmsQueryKeys.settings,
    queryFn: fetchSiteSettings,
    enabled: isSupabaseConfigured,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useSiteSettings(): { settings: SiteSettingsPayload; isLoading: boolean } {
  const q = useSettingsContent();
  if (!isSupabaseConfigured) {
    return { settings: { ...DEFAULT_SITE_SETTINGS }, isLoading: false };
  }
  if (q.isError) {
    return { settings: { ...DEFAULT_SITE_SETTINGS }, isLoading: false };
  }
  if (q.isPending) {
    return { settings: { ...DEFAULT_SITE_SETTINGS }, isLoading: true };
  }
  return { settings: q.data ?? { ...DEFAULT_SITE_SETTINGS }, isLoading: false };
}
