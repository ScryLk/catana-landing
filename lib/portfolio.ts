/* Portfólio: catálogos de demonstração renderizados de `catalogos/*.pdf`
   para `public/portfolio/<slug>/`. Cada item expõe capa + 4 páginas
   internas (p01 = capa; demais seguem a numeração do PDF). */

export type PortfolioItem = {
  slug: string;
  nome: string;
  segmento: string;
  peca: string;
  paginas: number;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    slug: "casa-braseiro",
    nome: "Casa Braseiro",
    segmento: "Carnes nobres",
    peca: "Catálogo 2026",
    paginas: 14,
  },
  {
    slug: "casa-confete",
    nome: "Casa Confete",
    segmento: "Artigos de festa",
    peca: "Coleção 2026",
    paginas: 14,
  },
  {
    slug: "aurea",
    nome: "Áurea",
    segmento: "Moda autoral",
    peca: "Coleção 01 · Inverno 2026",
    paginas: 14,
  },
  {
    slug: "forno-alvorada",
    nome: "Forno Alvorada",
    segmento: "Padaria artesanal",
    peca: "Catálogo 2026",
    paginas: 14,
  },
  {
    slug: "mercado-boa-praca",
    nome: "Mercado Boa Praça",
    segmento: "Mercado & hortifrúti",
    peca: "Ofertas 2026",
    paginas: 14,
  },
  {
    slug: "casa-jabuticaba",
    nome: "Casa Jabuticaba",
    segmento: "Cozinha brasileira",
    peca: "Cardápio · Inverno 2026",
    paginas: 14,
  },
];

/* Páginas exportadas de cada PDF (a primeira é a capa) */
export const PAGES = ["p01.jpg", "p03.jpg", "p05.jpg", "p08.jpg", "p12.jpg"];

export const pageSrc = (slug: string, page: string) =>
  `/portfolio/${slug}/${page}`;
