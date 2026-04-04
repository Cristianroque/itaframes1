import { motion } from "framer-motion";
import { useState } from "react";
import { Send, MessageCircle, Instagram, Youtube, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

  const whatsappUrl = "https://wa.me/5500000000000?text=Olá! Gostaria de saber mais sobre os serviços do Ita Frames.";

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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Vamos criar algo incrível juntos
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Form */}
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

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">Fale Conosco</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Tem um evento especial? Adoraríamos ouvir sobre ele. Entre em contato para discutirmos como podemos tornar seu momento inesquecível.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 bg-[#25d366]/10 border border-[#25d366]/30 rounded-sm text-[#25d366] hover:bg-[#25d366]/20 transition-colors"
            >
              <MessageCircle size={20} />
              <span className="font-body text-sm tracking-wider">Fale pelo WhatsApp</span>
            </a>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail size={18} className="text-primary" />
                <span className="font-body text-sm">contato@itaframes.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone size={18} className="text-primary" />
                <span className="font-body text-sm">(00) 00000-0000</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
