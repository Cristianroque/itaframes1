import { motion } from "framer-motion";
import aboutPhoto from "@/assets/about-photo.jpg";
import { Camera, Film, Award } from "lucide-react";

const stats = [
  { icon: Camera, value: "500+", label: "Eventos" },
  { icon: Film, value: "8+", label: "Anos de Experiência" },
  { icon: Award, value: "100%", label: "Satisfação" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-sm">
              <img
                src={aboutPhoto}
                alt="Fotógrafo profissional"
                loading="lazy"
                width={800}
                height={1000}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary rounded-sm -z-10" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">Sobre Mim</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              A arte de contar histórias através das lentes
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Sou um fotógrafo e cinegrafista apaixonado por capturar momentos únicos. Com mais de 8 anos de experiência em cobertura de eventos, especializei-me em transformar celebrações em narrativas visuais cinematográficas.
              </p>
              <p>
                Minha abordagem combina técnica refinada com sensibilidade artística, garantindo que cada imagem e cada frame reflitam a emoção genuína do momento. Trabalho com equipamentos de última geração para entregar resultados de qualidade premium.
              </p>
              <p>
                De casamentos íntimos a grandes eventos corporativos, cada projeto recebe dedicação total e um olhar criativo único que diferencia o Ita Frames no mercado.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="font-body text-xs tracking-wider uppercase text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
