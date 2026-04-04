import { motion } from "framer-motion";
import { useState } from "react";
import { Send, MessageCircle, Instagram, Youtube, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import type { SiteSettingsPayload } from "@/lib/cms-defaults";
import { DEFAULT_SITE_SETTINGS } from "@/lib/cms-defaults";

export type ContactSectionProps = {
  settings?: SiteSettingsPayload;
};

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

function instagramHref(handle: string) {
  const h = handle.trim().replace(/^@/, "");
  if (!h) return "#";
  return `https://instagram.com/${h}`;
}

const ContactSection = ({ settings = DEFAULT_SITE_SETTINGS }: ContactSectionProps) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

  const wa = digitsOnly(settings.whatsapp);
  const whatsappUrl = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre os serviços do Ita Frames.")}`
    : "#";

  const yt = settings.youtube.trim();
  const youtubeHref = yt && (yt.startsWith("http") ? yt : `https://youtube.com/${yt.replace(/^@/, "")}`);

  return (
    <section id="contato" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">Contato</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">{settings.contactHeadline}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                className="w-full bg-card border border-border px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors rounded-sm"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Seu email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                className="w-full bg-card border border-border px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors rounded-sm"
              />
            </div>
            <div>
              <textarea
                placeholder="Sua mensagem"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                className="w-full bg-card border border-border px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors rounded-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50"
            >
              <Send size={16} />
              {sending ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">Fale Conosco</h3>
              <p className="font-body text-muted-foreground leading-relaxed">{settings.contactIntro}</p>
            </div>

            {wa ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-[#25d366]/10 border border-[#25d366]/30 rounded-sm text-[#25d366] hover:bg-[#25d366]/20 transition-colors"
              >
                <MessageCircle size={20} />
                <span className="font-body text-sm tracking-wider">Fale pelo WhatsApp</span>
              </a>
            ) : null}

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail size={18} className="text-primary" />
                <a href={`mailto:${settings.email}`} className="font-body text-sm hover:text-primary transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone size={18} className="text-primary" />
                <span className="font-body text-sm">{settings.phone}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href={instagramHref(settings.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-12 h-12 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Instagram size={18} />
              </a>
              {youtubeHref ? (
                <a
                  href={youtubeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-12 h-12 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Youtube size={18} />
                </a>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
