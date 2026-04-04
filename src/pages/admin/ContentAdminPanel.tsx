import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchAboutPayload, fetchHeroPayload, saveAboutPayload, saveHeroPayload } from "@/api/content";
import { uploadMediaFile } from "@/api/media";
import { cmsQueryKeys } from "@/hooks/useCmsQueries";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import {
  DEFAULT_ABOUT_PAYLOAD,
  DEFAULT_HERO_PAYLOAD,
  type AboutPayload,
  type HeroPayload,
} from "@/lib/cms-defaults";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContentAdminPanel() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState<string | null>(null);

  const heroQ = useQuery({
    queryKey: cmsQueryKeys.hero,
    queryFn: fetchHeroPayload,
    enabled: isSupabaseConfigured,
  });
  const aboutQ = useQuery({
    queryKey: cmsQueryKeys.about,
    queryFn: fetchAboutPayload,
    enabled: isSupabaseConfigured,
  });

  const [hero, setHero] = useState<HeroPayload>({ ...DEFAULT_HERO_PAYLOAD });
  const [about, setAbout] = useState<AboutPayload>({
    ...DEFAULT_ABOUT_PAYLOAD,
    paragraphs: [...DEFAULT_ABOUT_PAYLOAD.paragraphs],
    stats: [...DEFAULT_ABOUT_PAYLOAD.stats],
  });
  const [paragraphsText, setParagraphsText] = useState(DEFAULT_ABOUT_PAYLOAD.paragraphs.join("\n\n"));

  useEffect(() => {
    if (heroQ.data) setHero(heroQ.data);
  }, [heroQ.data]);

  useEffect(() => {
    if (aboutQ.data) {
      setAbout(aboutQ.data);
      setParagraphsText(aboutQ.data.paragraphs.join("\n\n"));
    }
  }, [aboutQ.data]);

  const saveHero = useMutation({
    mutationFn: () => saveHeroPayload(hero),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cmsQueryKeys.hero });
      toast.success("Hero atualizada.");
    },
    onError: () => toast.error("Erro ao salvar hero."),
  });

  const saveAbout = useMutation({
    mutationFn: () => {
      const paragraphs = paragraphsText
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);
      return saveAboutPayload({ ...about, paragraphs: paragraphs.length ? paragraphs : about.paragraphs });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cmsQueryKeys.about });
      toast.success("Sobre atualizado.");
    },
    onError: () => toast.error("Erro ao salvar sobre."),
  });

  const upload = async (file: File, field: "hero-bg" | "hero-photo" | "about") => {
    setUploading(field);
    try {
      const url = await uploadMediaFile(file, field === "about" ? "about" : "hero");
      if (field === "hero-bg") setHero((h) => ({ ...h, backgroundImageUrl: url }));
      if (field === "hero-photo") setHero((h) => ({ ...h, photographerImageUrl: url }));
      if (field === "about") setAbout((a) => ({ ...a, imageUrl: url }));
      toast.success("Upload concluído.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setUploading(null);
    }
  };

  const inputClass = "mt-1 bg-background border-border";

  if (!isSupabaseConfigured) {
    return (
      <p className="font-body text-sm text-muted-foreground">
        Configure o Supabase para editar conteúdo dinâmico.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-sm p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Hero</h3>
        {heroQ.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Linha superior (eyebrow)</Label>
              <Input value={hero.eyebrow} onChange={(e) => setHero((h) => ({ ...h, eyebrow: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Título (antes do destaque)</Label>
              <Input
                value={hero.headlineBefore}
                onChange={(e) => setHero((h) => ({ ...h, headlineBefore: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Palavra em destaque (itálico)</Label>
              <Input
                value={hero.headlineAccent}
                onChange={(e) => setHero((h) => ({ ...h, headlineAccent: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Subtítulo</Label>
              <Textarea
                value={hero.subheadline}
                onChange={(e) => setHero((h) => ({ ...h, subheadline: e.target.value }))}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">URL imagem de fundo</Label>
              <Input
                value={hero.backgroundImageUrl}
                onChange={(e) => setHero((h) => ({ ...h, backgroundImageUrl: e.target.value }))}
                className={inputClass}
              />
              <label className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload(f, "hero-bg");
                    e.target.value = "";
                  }}
                />
                <span className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-sm">
                  {uploading === "hero-bg" ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                  Upload fundo
                </span>
              </label>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">URL foto do fotógrafo</Label>
              <Input
                value={hero.photographerImageUrl}
                onChange={(e) => setHero((h) => ({ ...h, photographerImageUrl: e.target.value }))}
                className={inputClass}
              />
              <label className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload(f, "hero-photo");
                    e.target.value = "";
                  }}
                />
                <span className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-sm">
                  {uploading === "hero-photo" ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                  Upload retrato
                </span>
              </label>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Alt da foto</Label>
              <Input
                value={hero.photographerImageAlt}
                onChange={(e) => setHero((h) => ({ ...h, photographerImageAlt: e.target.value }))}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              disabled={saveHero.isPending}
              onClick={() => saveHero.mutate()}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 disabled:opacity-50"
            >
              <Save size={14} /> Salvar Hero
            </button>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-sm p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Sobre</h3>
        {aboutQ.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Eyebrow</Label>
              <Input value={about.eyebrow} onChange={(e) => setAbout((a) => ({ ...a, eyebrow: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Título</Label>
              <Input value={about.title} onChange={(e) => setAbout((a) => ({ ...a, title: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Parágrafos (separe com linha em branco)</Label>
              <Textarea
                value={paragraphsText}
                onChange={(e) => setParagraphsText(e.target.value)}
                rows={10}
                className={`${inputClass} resize-none font-body text-sm`}
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">URL da imagem</Label>
              <Input
                value={about.imageUrl}
                onChange={(e) => setAbout((a) => ({ ...a, imageUrl: e.target.value }))}
                className={inputClass}
              />
              <label className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload(f, "about");
                    e.target.value = "";
                  }}
                />
                <span className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-sm">
                  {uploading === "about" ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                  Upload imagem
                </span>
              </label>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Alt da imagem</Label>
              <Input
                value={about.imageAlt}
                onChange={(e) => setAbout((a) => ({ ...a, imageAlt: e.target.value }))}
                className={inputClass}
              />
            </div>
            <p className="text-xs text-muted-foreground font-body">Estatísticas: ícones camera, film ou award</p>
            {about.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Ícone"
                  value={s.iconKey}
                  onChange={(e) =>
                    setAbout((a) => {
                      const stats = [...a.stats];
                      stats[i] = { ...stats[i], iconKey: e.target.value };
                      return { ...a, stats };
                    })
                  }
                  className={inputClass}
                />
                <Input
                  placeholder="Valor"
                  value={s.value}
                  onChange={(e) =>
                    setAbout((a) => {
                      const stats = [...a.stats];
                      stats[i] = { ...stats[i], value: e.target.value };
                      return { ...a, stats };
                    })
                  }
                  className={inputClass}
                />
                <Input
                  placeholder="Rótulo"
                  value={s.label}
                  onChange={(e) =>
                    setAbout((a) => {
                      const stats = [...a.stats];
                      stats[i] = { ...stats[i], label: e.target.value };
                      return { ...a, stats };
                    })
                  }
                  className={inputClass}
                />
              </div>
            ))}
            <button
              type="button"
              disabled={saveAbout.isPending}
              onClick={() => saveAbout.mutate()}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 disabled:opacity-50"
            >
              <Save size={14} /> Salvar Sobre
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
