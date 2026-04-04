/**
 * Fachada da API do CMS — espelha organização REST documentada:
 * - projetos → ./projects
 * - conteúdo (hero, sobre) → ./content
 * - mídia (upload) → ./media
 * - configurações → ./settings
 */
export * as projectsApi from "./projects";
export * as contentApi from "./content";
export * as mediaApi from "./media";
export * as settingsApi from "./settings";
