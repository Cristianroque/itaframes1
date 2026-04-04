import type { PortfolioProject } from "@/types/portfolio";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import project6 from "@/assets/project-6.jpg";

/** Amostra de vídeo (MP4 público) — em produção virá de URL administrável. */
const sampleVideoSrc =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export const defaultProjects: PortfolioProject[] = [
  {
    id: "local-1",
    title: "Casamento Ana & Pedro",
    category: "Casamento",
    description:
      "Uma celebração inesquecível no salão de festas com decoração clássica e momentos emocionantes.",
    coverImage: project1,
    media: [{ id: "1-1", type: "image", src: project1, alt: "Casamento Ana & Pedro" }],
  },
  {
    id: "local-2",
    title: "Festa de 15 Anos - Camila",
    category: "Festa",
    description:
      "Uma noite mágica cheia de energia, luzes e muita celebração para a aniversariante.",
    coverImage: project2,
    media: [{ id: "2-1", type: "image", src: project2, alt: "Festa de 15 Anos - Camila" }],
  },
  {
    id: "local-3",
    title: "Gala Corporativa Luxe",
    category: "Corporativo",
    description: "Evento corporativo sofisticado com ambientação premium e cobertura completa.",
    coverImage: project3,
    media: [
      { id: "3-1", type: "image", src: project3, alt: "Gala Corporativa Luxe" },
      {
        id: "3-2",
        type: "video",
        src: sampleVideoSrc,
        poster: project3,
      },
    ],
  },
  {
    id: "local-4",
    title: "Casamento Julia & Rafael",
    category: "Casamento",
    description:
      "Cerimônia ao ar livre durante o pôr do sol com decoração floral deslumbrante.",
    coverImage: project4,
    media: [{ id: "4-1", type: "image", src: project4, alt: "Casamento Julia & Rafael" }],
  },
  {
    id: "local-5",
    title: "Debutante Isabella",
    category: "Debutante",
    description: "Uma noite de princesa com fogos de artifício, valsa e muita emoção.",
    coverImage: project5,
    media: [{ id: "5-1", type: "image", src: project5, alt: "Debutante Isabella" }],
  },
  {
    id: "local-6",
    title: "Festival Sonora",
    category: "Show",
    description:
      "Cobertura completa de festival musical com luzes, palco e público vibrante.",
    coverImage: project6,
    media: [{ id: "6-1", type: "image", src: project6, alt: "Festival Sonora" }],
  },
];
