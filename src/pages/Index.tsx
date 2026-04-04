import { useEffect, useRef } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useSiteAbout, useSiteHero, useSiteProjects, useSiteSettings } from "@/hooks/useCmsQueries";

const Index = () => {
  const { projects, isLoading, isError } = useSiteProjects();
  const { hero } = useSiteHero();
  const { about } = useSiteAbout();
  const { settings } = useSiteSettings();
  const warned = useRef(false);

  useEffect(() => {
    if (isError && !warned.current) {
      warned.current = true;
      toast.error("Não foi possível carregar os projetos do servidor. Exibindo conteúdo de fallback.");
    }
  }, [isError]);

  return (
    <>
      <Header />
      <HeroSection {...hero} />
      <ProjectsSection projects={projects} isLoading={isLoading} />
      <AboutSection about={about} />
      <ContactSection settings={settings} />
      <Footer />
    </>
  );
};

export default Index;
