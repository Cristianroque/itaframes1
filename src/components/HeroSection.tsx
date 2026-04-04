import { motion } from "framer-motion";
import { defaultHeroContent, type HeroContent } from "@/content/hero";

export type HeroSectionProps = Partial<HeroContent>;

const HeroSection = ({
  eyebrow = defaultHeroContent.eyebrow,
  headlineBefore = defaultHeroContent.headlineBefore,
  headlineAccent = defaultHeroContent.headlineAccent,
  subheadline = defaultHeroContent.subheadline,
  backgroundImageUrl = defaultHeroContent.backgroundImageUrl,
  photographerImageUrl = defaultHeroContent.photographerImageUrl,
  photographerImageAlt = defaultHeroContent.photographerImageAlt,
}: HeroSectionProps) => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={backgroundImageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

      <div className="relative z-10 container mx-auto px-4 w-full py-28 md:py-32 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center w-full">
          <div className="order-1 flex flex-col items-center lg:items-stretch text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="w-full max-w-xl lg:max-w-none mx-auto lg:mx-0"
            >
              <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-6">{eyebrow}</p>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6">
                {headlineBefore}
                <span className="italic text-primary">{headlineAccent}</span>
              </h1>

              <p className="font-body text-lg text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">{subheadline}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#projetos"
                  className="inline-flex items-center justify-center px-8 py-4 font-body text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-sm"
                >
                  Ver Projetos
                </a>
                <a
                  href="#contato"
                  className="inline-flex items-center justify-center px-8 py-4 font-body text-sm tracking-widest uppercase border border-foreground/30 text-foreground hover:border-primary hover:text-primary transition-colors rounded-sm"
                >
                  Entrar em Contato
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35 }}
            className="order-2 flex justify-center lg:justify-end lg:items-end"
          >
            {/* Retrato: mostrar busto até ~cintura — contentor alto + foco no centro superior da foto */}
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-hidden h-[min(58vh,520px)] sm:h-[min(64vh,600px)] lg:h-[min(70vh,680px)]">
              <img
                src={photographerImageUrl}
                alt={photographerImageAlt}
                width={900}
                height={1120}
                className="h-full w-full object-cover border-0 shadow-none"
                style={{ objectPosition: "center 38%" }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
