import heroBg from "@/assets/hero-bg.jpg";
import itaPhoto from "@/assets/ita-photo.PNG";

/** Payload armazenado em site_content.value (key: hero) */
export type HeroPayload = {
  eyebrow: string;
  headlineBefore: string;
  headlineAccent: string;
  subheadline: string;
  backgroundImageUrl: string;
  photographerImageUrl: string;
  photographerImageAlt: string;
};

/** Payload site_content key: about */
export type AboutStatPayload = { iconKey: string; value: string; label: string };
export type AboutPayload = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  stats: AboutStatPayload[];
};

export type SiteSettingsPayload = {
  whatsapp: string;
  email: string;
  instagram: string;
  youtube: string;
  phone: string;
  primaryColor: string;
  contactHeadline: string;
  contactIntro: string;
};

export const DEFAULT_HERO_PAYLOAD: HeroPayload = {
  eyebrow: "Fotografia & Filmagem de Eventos",
  headlineBefore: "Transformando momentos em histórias ",
  headlineAccent: "cinematográficas",
  subheadline:
    "Capturamos a essência dos seus momentos mais especiais com qualidade cinematográfica e atenção a cada detalhe.",
  backgroundImageUrl: heroBg,
  photographerImageUrl: itaPhoto,
  photographerImageAlt: "Fotógrafo profissional Ita Frames",
};

export const DEFAULT_ABOUT_PAYLOAD: AboutPayload = {
  eyebrow: "Sobre Mim",
  title: "A arte de contar histórias através das lentes",
  paragraphs: [
    "Sou um fotógrafo e cinegrafista apaixonado por capturar momentos únicos. Com mais de 8 anos de experiência em cobertura de eventos, especializei-me em transformar celebrações em narrativas visuais cinematográficas.",
    "Minha abordagem combina técnica refinada com sensibilidade artística, garantindo que cada imagem e cada frame reflitam a emoção genuína do momento. Trabalho com equipamentos de última geração para entregar resultados de qualidade premium.",
    "De casamentos íntimos a grandes eventos corporativos, cada projeto recebe dedicação total e um olhar criativo único que diferencia o Ita Frames no mercado.",
  ],
  imageUrl: itaPhoto,
  imageAlt: "Fotógrafo profissional",
  stats: [
    { iconKey: "camera", value: "500+", label: "Eventos" },
    { iconKey: "film", value: "8+", label: "Anos de Experiência" },
    { iconKey: "award", value: "100%", label: "Satisfação" },
  ],
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsPayload = {
  whatsapp: "5500000000000",
  email: "contato@itaframes.com",
  instagram: "@itaframes",
  youtube: "",
  phone: "(00) 00000-0000",
  primaryColor: "#7c0b0b",
  contactHeadline: "Vamos criar algo incrível juntos",
  contactIntro:
    "Tem um evento especial? Adoraríamos ouvir sobre ele. Entre em contato para discutirmos como podemos tornar seu momento inesquecível.",
};

export function mergeHeroPayload(raw: unknown): HeroPayload {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_HERO_PAYLOAD };
  const o = raw as Record<string, unknown>;
  return {
    eyebrow: typeof o.eyebrow === "string" ? o.eyebrow : DEFAULT_HERO_PAYLOAD.eyebrow,
    headlineBefore:
      typeof o.headlineBefore === "string" ? o.headlineBefore : DEFAULT_HERO_PAYLOAD.headlineBefore,
    headlineAccent:
      typeof o.headlineAccent === "string" ? o.headlineAccent : DEFAULT_HERO_PAYLOAD.headlineAccent,
    subheadline: typeof o.subheadline === "string" ? o.subheadline : DEFAULT_HERO_PAYLOAD.subheadline,
    backgroundImageUrl:
      typeof o.backgroundImageUrl === "string" && o.backgroundImageUrl
        ? o.backgroundImageUrl
        : DEFAULT_HERO_PAYLOAD.backgroundImageUrl,
    photographerImageUrl:
      typeof o.photographerImageUrl === "string" && o.photographerImageUrl
        ? o.photographerImageUrl
        : DEFAULT_HERO_PAYLOAD.photographerImageUrl,
    photographerImageAlt:
      typeof o.photographerImageAlt === "string"
        ? o.photographerImageAlt
        : DEFAULT_HERO_PAYLOAD.photographerImageAlt,
  };
}

export function mergeAboutPayload(raw: unknown): AboutPayload {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_ABOUT_PAYLOAD, paragraphs: [...DEFAULT_ABOUT_PAYLOAD.paragraphs], stats: [...DEFAULT_ABOUT_PAYLOAD.stats] };
  const o = raw as Record<string, unknown>;
  const paragraphs = Array.isArray(o.paragraphs)
    ? o.paragraphs.filter((p): p is string => typeof p === "string")
    : DEFAULT_ABOUT_PAYLOAD.paragraphs;
  const statsRaw = Array.isArray(o.stats) ? o.stats : DEFAULT_ABOUT_PAYLOAD.stats;
  const stats = statsRaw
    .map((s) => {
      if (!s || typeof s !== "object") return null;
      const x = s as Record<string, unknown>;
      if (typeof x.iconKey !== "string" || typeof x.value !== "string" || typeof x.label !== "string")
        return null;
      return { iconKey: x.iconKey, value: x.value, label: x.label };
    })
    .filter(Boolean) as AboutStatPayload[];
  return {
    eyebrow: typeof o.eyebrow === "string" ? o.eyebrow : DEFAULT_ABOUT_PAYLOAD.eyebrow,
    title: typeof o.title === "string" ? o.title : DEFAULT_ABOUT_PAYLOAD.title,
    paragraphs: paragraphs.length ? paragraphs : DEFAULT_ABOUT_PAYLOAD.paragraphs,
    imageUrl:
      typeof o.imageUrl === "string" && o.imageUrl ? o.imageUrl : DEFAULT_ABOUT_PAYLOAD.imageUrl,
    imageAlt: typeof o.imageAlt === "string" ? o.imageAlt : DEFAULT_ABOUT_PAYLOAD.imageAlt,
    stats: stats.length ? stats : DEFAULT_ABOUT_PAYLOAD.stats,
  };
}

export function mergeSiteSettings(row: Partial<SiteSettingsPayload> | null | undefined): SiteSettingsPayload {
  if (!row) return { ...DEFAULT_SITE_SETTINGS };
  return {
    whatsapp: row.whatsapp ?? DEFAULT_SITE_SETTINGS.whatsapp,
    email: row.email ?? DEFAULT_SITE_SETTINGS.email,
    instagram: row.instagram ?? DEFAULT_SITE_SETTINGS.instagram,
    youtube: row.youtube ?? DEFAULT_SITE_SETTINGS.youtube,
    phone: row.phone ?? DEFAULT_SITE_SETTINGS.phone,
    primaryColor: row.primaryColor ?? DEFAULT_SITE_SETTINGS.primaryColor,
    contactHeadline: row.contactHeadline ?? DEFAULT_SITE_SETTINGS.contactHeadline,
    contactIntro: row.contactIntro ?? DEFAULT_SITE_SETTINGS.contactIntro,
  };
}
