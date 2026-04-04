import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { fetchSiteSettings, saveSiteSettings } from "@/api/settings";
import { cmsQueryKeys } from "@/hooks/useCmsQueries";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { DEFAULT_SITE_SETTINGS, type SiteSettingsPayload } from "@/lib/cms-defaults";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function SettingsAdminPanel() {
  const queryClient = useQueryClient();
  const q = useQuery({
    queryKey: cmsQueryKeys.settings,
    queryFn: fetchSiteSettings,
    enabled: isSupabaseConfigured,
  });
  const [form, setForm] = useState<SiteSettingsPayload>({ ...DEFAULT_SITE_SETTINGS });

  useEffect(() => {
    if (q.data) setForm(q.data);
  }, [q.data]);

  const save = useMutation({
    mutationFn: () => saveSiteSettings(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cmsQueryKeys.settings });
      toast.success("Configurações salvas.");
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  const inputClass = "mt-1 bg-background border-border";

  if (!isSupabaseConfigured) {
    return (
      <p className="font-body text-sm text-muted-foreground">
        Configure o Supabase para editar configurações no banco.
      </p>
    );
  }

  if (q.isLoading) {
    return <p className="text-sm text-muted-foreground font-body">Carregando…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-sm p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Contato & redes</h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp (apenas números com DDI)</Label>
            <Input
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Telefone (texto exibido)</Label>
            <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Instagram (@usuario)</Label>
            <Input
              value={form.instagram}
              onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">YouTube (URL completa)</Label>
            <Input
              value={form.youtube}
              onChange={(e) => setForm((f) => ({ ...f, youtube: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Seção Contato (textos)</h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Título</Label>
            <Input
              value={form.contactHeadline}
              onChange={(e) => setForm((f) => ({ ...f, contactHeadline: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Texto lateral</Label>
            <Textarea
              value={form.contactIntro}
              onChange={(e) => setForm((f) => ({ ...f, contactIntro: e.target.value }))}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Referência de marca</h3>
        <div>
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Cor principal (hex)</Label>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="color"
              value={form.primaryColor.length === 7 ? form.primaryColor : "#7c0b0b"}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <Input
              value={form.primaryColor}
              onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
              className={`${inputClass} max-w-xs`}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-body">
            Guardado no banco; integração com tema Tailwind pode ser feita depois.
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={save.isPending}
        onClick={() => save.mutate()}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 disabled:opacity-50"
      >
        <Save size={14} /> Salvar configurações
      </button>
    </div>
  );
}
