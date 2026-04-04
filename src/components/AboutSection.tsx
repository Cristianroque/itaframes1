import { motion } from "framer-motion";
import { Camera, Film, Award, type LucideIcon } from "lucide-react";
import type { AboutPayload } from "@/lib/cms-defaults";
import { DEFAULT_ABOUT_PAYLOAD } from "@/lib/cms-defaults";

const iconMap: Record<string, LucideIcon> = {
  camera: Camera,
  film: Film,
  award: Award,
};

export type AboutSectionProps = {
  about?: AboutPayload;
};

const AboutSection = ({
  about = {
    ...DEFAULT_ABOUT_PAYLOAD,
    paragraphs: [...DEFAULT_ABOUT_PAYLOAD.paragraphs],
    stats: [...DEFAULT_ABOUT_PAYLOAD.stats],
  },
}: AboutSectionProps) => {
  return (
    <section id="sobre" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="w-full max-w-xs sm:max-w-sm overflow-hidden rounded-sm">
              <img
                src={about.imageUrl}
                alt={about.imageAlt}
                loading="lazy"
                width={800}
                height={1000}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">{about.eyebrow}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">{about.title}</h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              {about.stats.map((stat) => {
                const Icon = iconMap[stat.iconKey] ?? Camera;
                return (
                  <div key={stat.label} className="text-center">
                    <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="font-body text-xs tracking-wider uppercase text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
