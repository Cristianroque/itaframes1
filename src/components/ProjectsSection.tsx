import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { PortfolioProject, ProjectMediaItem } from "@/types/portfolio";
import { resolveVideoEmbedSrc } from "@/lib/embedUrl";
import { defaultProjects } from "@/data/projects";
import { Skeleton } from "@/components/ui/skeleton";

/** Altura máxima da mídia no lightbox — usa quase todo o ecrã, preservando proporção. */
const mediaMaxClass = "max-h-[min(92vh,1080px)] w-full max-w-full";

function ProjectMediaBlock({ item, fallbackAlt }: { item: ProjectMediaItem; fallbackAlt: string }) {
  if (item.type === "image") {
    return (
      <img
        src={item.src}
        alt={item.alt ?? fallbackAlt}
        loading="lazy"
        width={1200}
        height={800}
        className={`rounded-sm object-contain bg-muted ${mediaMaxClass} h-auto`}
      />
    );
  }

  if (item.type === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        controls
        playsInline
        preload="metadata"
        className={`rounded-sm bg-black object-contain ${mediaMaxClass} h-auto`}
      >
        Seu navegador não suporta reprodução de vídeo.
      </video>
    );
  }

  const embedSrc = resolveVideoEmbedSrc(item.src);
  if (!embedSrc) {
    return (
      <p className="font-body text-sm text-muted-foreground p-4 border border-border rounded-sm">
        Não foi possível incorporar este link. Cole o URL completo do YouTube (página do vídeo, Shorts ou youtu.be) ou do
        Vimeo.
      </p>
    );
  }

  return (
    <div className="relative aspect-video w-full min-w-0 overflow-hidden rounded-sm bg-black border border-border">
      <iframe
        src={embedSrc}
        title={item.title ?? "Vídeo incorporado"}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export type ProjectsSectionProps = {
  projects?: PortfolioProject[];
  isLoading?: boolean;
};

const ProjectsSection = ({ projects = defaultProjects, isLoading = false }: ProjectsSectionProps) => {
  const categories = useMemo(() => {
    const unique = [...new Set(projects.map((p) => p.category))].sort();
    return ["Todos", ...unique];
  }, [projects]);

  const [filter, setFilter] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const filtered = filter === "Todos" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projetos" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">Portfólio</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Meus Projetos</h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-xs tracking-widest uppercase font-body transition-all rounded-sm ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-sm bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center font-body text-muted-foreground py-16">
            Nenhum projeto nesta categoria. Adicione conteúdo pelo painel administrativo.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="group relative overflow-hidden rounded-sm cursor-pointer aspect-[4/3]"
              >
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center font-body text-sm text-muted-foreground">
                    Sem capa
                  </div>
                )}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6"
                  style={{ background: "var(--gradient-card)" }}
                >
                  <span className="text-xs tracking-widest uppercase text-primary font-body">{project.category}</span>
                  <h3 className="font-display text-xl font-semibold text-foreground mt-1">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-sm w-full max-w-[min(100vw-1.5rem,1280px)] overflow-hidden relative my-6 sm:my-8 flex flex-col max-h-[min(96vh,1200px)] shadow-lg border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-end gap-2 border-b border-border bg-card px-3 py-2 sm:px-4 sm:py-3">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                aria-label="Fechar"
              >
                <X className="h-6 w-6 sm:h-5 sm:w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6 space-y-6">
              <div className="space-y-6">
                {selectedProject.media.map((item) => (
                  <div key={item.id} className="w-full">
                    <ProjectMediaBlock item={item} fallbackAlt={selectedProject.title} />
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-xs tracking-widest uppercase text-primary font-body">{selectedProject.category}</span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-2 mb-4">{selectedProject.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">{selectedProject.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
