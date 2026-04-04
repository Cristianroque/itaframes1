import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import project6 from "@/assets/project-6.jpg";

const defaultProjects = [
  { id: 1, title: "Casamento Ana & Pedro", category: "Casamento", image: project1, description: "Uma celebração inesquecível no salão de festas com decoração clássica e momentos emocionantes." },
  { id: 2, title: "Festa de 15 Anos - Camila", category: "Festa", image: project2, description: "Uma noite mágica cheia de energia, luzes e muita celebração para a aniversariante." },
  { id: 3, title: "Gala Corporativa Luxe", category: "Corporativo", image: project3, description: "Evento corporativo sofisticado com ambientação premium e cobertura completa." },
  { id: 4, title: "Casamento Julia & Rafael", category: "Casamento", image: project4, description: "Cerimônia ao ar livre durante o pôr do sol com decoração floral deslumbrante." },
  { id: 5, title: "Debutante Isabella", category: "Debutante", image: project5, description: "Uma noite de princesa com fogos de artifício, valsa e muita emoção." },
  { id: 6, title: "Festival Sonora", category: "Show", image: project6, description: "Cobertura completa de festival musical com luzes, palco e público vibrante." },
];

const categories = ["Todos", "Casamento", "Festa", "Corporativo", "Debutante", "Show"];

const ProjectsSection = () => {
  const [filter, setFilter] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<typeof defaultProjects[0] | null>(null);

  const filtered = filter === "Todos" ? defaultProjects : defaultProjects.filter(p => p.category === filter);

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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Nossos Projetos
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
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

        {/* Grid */}
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
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
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
      </div>

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-sm max-w-3xl w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 text-foreground/70 hover:text-foreground"
            >
              <X size={24} />
            </button>
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="p-8">
              <span className="text-xs tracking-widest uppercase text-primary font-body">{selectedProject.category}</span>
              <h3 className="font-display text-2xl font-bold text-foreground mt-2 mb-4">{selectedProject.title}</h3>
              <p className="font-body text-muted-foreground leading-relaxed">{selectedProject.description}</p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
