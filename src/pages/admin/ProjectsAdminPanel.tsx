import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createProject,
  deleteProject,
  fetchAllProjectsForAdmin,
  updateProject,
  type ProjectWriteInput,
} from "@/api/projects";
import { uploadMediaFile } from "@/api/media";
import { cmsQueryKeys } from "@/hooks/useCmsQueries";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import type { PortfolioProject, ProjectMediaItem } from "@/types/portfolio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type MediaDraft = {
  type: "image" | "video" | "video_embed";
  url: string;
  alt: string;
  poster_url: string;
};

type Draft = {
  id: string | null;
  title: string;
  category: string;
  description: string;
  cover_image_url: string;
  published: boolean;
  sort_order: number;
  media: MediaDraft[];
};

function mediaItemToDraft(m: ProjectMediaItem): MediaDraft {
  if (m.type === "image") return { type: "image", url: m.src, alt: m.alt ?? "", poster_url: "" };
  if (m.type === "video") return { type: "video", url: m.src, alt: "", poster_url: m.poster ?? "" };
  return { type: "video_embed", url: m.src, alt: m.title ?? "", poster_url: "" };
}

function emptyDraft(sortOrder: number): Draft {
  return {
    id: null,
    title: "",
    category: "Casamento",
    description: "",
    cover_image_url: "",
    published: true,
    sort_order: sortOrder,
    media: [{ type: "image", url: "", alt: "", poster_url: "" }],
  };
}

function projectToDraft(p: PortfolioProject): Draft {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    cover_image_url: p.coverImage,
    published: p.published ?? true,
    sort_order: p.sortOrder ?? 0,
    media: p.media.length ? p.media.map(mediaItemToDraft) : [{ type: "image", url: "", alt: "", poster_url: "" }],
  };
}

function draftToInput(d: Draft): ProjectWriteInput {
  const media = d.media
    .filter((m) => m.url.trim())
    .map((m) => ({
      type: m.type,
      url: m.url.trim(),
      alt: m.alt.trim() || undefined,
      poster_url: m.poster_url.trim() || null,
    }));
  return {
    title: d.title.trim(),
    description: d.description.trim(),
    category: d.category.trim() || "Geral",
    cover_image_url: d.cover_image_url.trim() || null,
    published: d.published,
    sort_order: d.sort_order,
    media,
  };
}

export function ProjectsAdminPanel() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: cmsQueryKeys.projectsAdmin,
    queryFn: fetchAllProjectsForAdmin,
    enabled: isSupabaseConfigured,
  });

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(0));
  const [uploading, setUploading] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const input = draftToInput(draft);
      if (!input.title) throw new Error("Título é obrigatório.");
      if (draft.id) await updateProject(draft.id, input);
      else await createProject(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cmsQueryKeys.projectsAdmin });
      await queryClient.invalidateQueries({ queryKey: cmsQueryKeys.projectsPublished });
      toast.success("Projeto salvo.");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message || "Erro ao salvar."),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cmsQueryKeys.projectsAdmin });
      await queryClient.invalidateQueries({ queryKey: cmsQueryKeys.projectsPublished });
      toast.success("Projeto removido.");
    },
    onError: () => toast.error("Não foi possível remover."),
  });

  const openNew = () => {
    const nextOrder =
      projects.length === 0 ? 0 : Math.max(...projects.map((p) => p.sortOrder ?? 0)) + 1;
    setDraft(emptyDraft(nextOrder));
    setOpen(true);
  };

  const openEdit = (p: PortfolioProject) => {
    setDraft(projectToDraft(p));
    setOpen(true);
  };

  const addMediaRow = () => {
    setDraft((d) => ({ ...d, media: [...d.media, { type: "image", url: "", alt: "", poster_url: "" }] }));
  };

  const removeMediaRow = (index: number) => {
    setDraft((d) => ({ ...d, media: d.media.filter((_, i) => i !== index) }));
  };

  const uploadField = async (file: File, kind: "cover" | `media-${number}`) => {
    setUploading(kind);
    try {
      const url = await uploadMediaFile(file, "projects");
      if (kind === "cover") setDraft((d) => ({ ...d, cover_image_url: url }));
      else {
        const idx = Number(kind.split("-")[1]);
        setDraft((d) => {
          const media = [...d.media];
          if (media[idx]) media[idx] = { ...media[idx], url };
          return { ...d, media };
        });
      }
      toast.success("Arquivo enviado.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setUploading(null);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <p className="font-body text-sm text-muted-foreground">
        Configure o Supabase para listar e editar projetos no banco de dados.
      </p>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-sm text-muted-foreground">
          {isLoading ? "Carregando…" : `${projects.length} projetos`}
        </p>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} /> Novo Projeto
        </button>
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">
                Título
              </th>
              <th className="text-left px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">
                Categoria
              </th>
              <th className="text-right px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 font-body text-sm text-foreground">{p.title}</td>
                <td className="px-6 py-4 font-body text-sm text-muted-foreground">{p.category}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="inline-flex text-muted-foreground hover:text-primary transition-colors p-1"
                    aria-label="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Remover este projeto?")) removeMutation.mutate(p.id);
                    }}
                    className="inline-flex text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{draft.id ? "Editar projeto" : "Novo projeto"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Título</Label>
              <Input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className="mt-1 bg-background border-border"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Categoria</Label>
              <Input
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                className="mt-1 bg-background border-border"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Descrição</Label>
              <Textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={4}
                className="mt-1 bg-background border-border resize-none"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">URL da capa (grade)</Label>
              <Input
                value={draft.cover_image_url}
                onChange={(e) => setDraft((d) => ({ ...d, cover_image_url: e.target.value }))}
                className="mt-1 bg-background border-border"
                placeholder="https://..."
              />
              <div className="mt-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void uploadField(f, "cover");
                      e.target.value = "";
                    }}
                  />
                  <span className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-sm hover:border-primary">
                    {uploading === "cover" ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                    Enviar imagem de capa
                  </span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="pub"
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
              />
              <Label htmlFor="pub" className="text-sm font-body cursor-pointer">
                Publicado (visível no site)
              </Label>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Ordem (menor = primeiro)</Label>
              <Input
                type="number"
                value={draft.sort_order}
                onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value) || 0 }))}
                className="mt-1 bg-background border-border w-32"
              />
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Mídias (galeria)</Label>
                <button type="button" onClick={addMediaRow} className="text-xs text-primary hover:underline font-body">
                  + Adicionar mídia
                </button>
              </div>
              {draft.media.map((m, i) => (
                <div key={i} className="p-3 border border-border rounded-sm space-y-2 bg-secondary/30">
                  <div className="flex justify-between">
                    <select
                      value={m.type}
                      onChange={(e) =>
                        setDraft((d) => {
                          const media = [...d.media];
                          media[i] = { ...media[i], type: e.target.value as MediaDraft["type"] };
                          return { ...d, media };
                        })
                      }
                      className="bg-background border border-border text-sm rounded-sm px-2 py-1 font-body"
                    >
                      <option value="image">Imagem</option>
                      <option value="video">Vídeo (arquivo URL)</option>
                      <option value="video_embed">Vídeo (embed / YouTube)</option>
                    </select>
                    <button type="button" onClick={() => removeMediaRow(i)} className="text-destructive text-xs">
                      Remover
                    </button>
                  </div>
                  <Input
                    placeholder="URL"
                    value={m.url}
                    onChange={(e) =>
                      setDraft((d) => {
                        const media = [...d.media];
                        media[i] = { ...media[i], url: e.target.value };
                        return { ...d, media };
                      })
                    }
                    className="bg-background border-border text-sm"
                  />
                  {m.type === "video" && (
                    <Input
                      placeholder="URL do poster (opcional)"
                      value={m.poster_url}
                      onChange={(e) =>
                        setDraft((d) => {
                          const media = [...d.media];
                          media[i] = { ...media[i], poster_url: e.target.value };
                          return { ...d, media };
                        })
                      }
                      className="bg-background border-border text-sm"
                    />
                  )}
                  {(m.type === "image" || m.type === "video_embed") && (
                    <Input
                      placeholder={m.type === "image" ? "Texto alternativo (opcional)" : "Título do iframe (opcional)"}
                      value={m.alt}
                      onChange={(e) =>
                        setDraft((d) => {
                          const media = [...d.media];
                          media[i] = { ...media[i], alt: e.target.value };
                          return { ...d, media };
                        })
                      }
                      className="bg-background border-border text-sm"
                    />
                  )}
                  {(m.type === "image" || m.type === "video") && (
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                      <input
                        type="file"
                        accept={
                          m.type === "image"
                            ? "image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif,.tif,.tiff"
                            : "video/*,audio/*,.mp4,.mov,.webm,.mkv,.avi,.m4v,.mpeg,.mpg,.3gp"
                        }
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void uploadField(f, `media-${i}`);
                          e.target.value = "";
                        }}
                      />
                      <span className="flex items-center gap-1 px-2 py-1 border border-border rounded-sm">
                        {uploading === `media-${i}` ? <Loader2 className="animate-spin" size={12} /> : <ImageIcon size={12} />}
                        Upload
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-border rounded-sm font-body text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-sm font-body text-sm disabled:opacity-50"
            >
              {saveMutation.isPending ? "Salvando…" : "Salvar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
