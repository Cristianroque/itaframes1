import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { PortfolioProject, ProjectMediaItem } from "@/types/portfolio";
import { resolveVideoEmbedSrc } from "@/lib/embedUrl";
import { defaultProjects } from "@/data/projects";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectMediaBlock({ item, fallbackAlt }: { item: ProjectMediaItem; fallbackAlt: string }) {
  if (item.type === "image") {
    return (
      <img
        src={item.src}
        alt={item.alt ?? fallbackAlt}
        loading="lazy"
        width={1200}
        height={800}
        className="w-full rounded-sm object-cover max-h-[min(70vh,520px)] bg-muted"
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
        className="w-full rounded-sm bg-black max-h-[min(70vh,520px)] object-contain"
      >
        Seu navegador não suporta reprodução de vídeo.
      </video>
    );
  }

  const embedSrc = resolveVideoEmbedSrc(item.src);
  if (!embedSrc) {
    return (
      <p className="font-body text-sm text-muted-foreground p-4 border border-border rounded-sm">
        URL do vídeo em falta ou inválida.
      </p>
    );
  }

  return (
    <div className="aspect-video w-full rounded-sm overflow-hidden bg-black border border-border">
      <iframe
        src={embedSrc}
        title={item.title ?? "Vídeo incorporado"}
        className="w-full h-full border-0"
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
            className="bg-card rounded-sm max-w-3xl w-full overflow-hidden relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 text-foreground/70 hover:text-foreground"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
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
