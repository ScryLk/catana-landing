"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PAGES, PORTFOLIO, pageSrc } from "@/lib/portfolio";

/* Galeria do portfólio: fileira única de capas com setas de navegação,
   que abre um folheador (lightbox) com as páginas internas. */
export default function PortfolioGallery() {
  // índice do catálogo aberto + página visível no folheador
  const [open, setOpen] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  // fileira: controle das setas conforme a posição do scroll
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, []);

  const flip = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.92, behavior: "smooth" });
  };

  const item = open !== null ? PORTFOLIO[open] : null;

  // Teclado: Esc fecha, setas folheiam. Scroll travado enquanto aberto.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight")
        setPage((p) => Math.min(p + 1, PAGES.length - 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Setas da fileira — coladas no eyebrow pra ganhar altura */}
      <div className="-mt-5 mb-3 flex items-center justify-end gap-2.5">
        <span className="mr-1 font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-400">
          {String(PORTFOLIO.length).padStart(2, "0")} CATÁLOGOS
        </span>
        <button
          type="button"
          aria-label="Catálogos anteriores"
          disabled={!canPrev}
          onClick={() => flip(-1)}
          className="cursor-pointer rounded-md border border-graphite-600 px-3 py-1.5 text-graphite-200 transition-colors hover:border-graphite-300 hover:text-graphite-100 disabled:cursor-default disabled:opacity-30 disabled:hover:border-graphite-600 disabled:hover:text-graphite-200"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Próximos catálogos"
          disabled={!canNext}
          onClick={() => flip(1)}
          className="cursor-pointer rounded-md border border-graphite-600 px-3 py-1.5 text-graphite-200 transition-colors hover:border-graphite-300 hover:text-graphite-100 disabled:cursor-default disabled:opacity-30 disabled:hover:border-graphite-600 disabled:hover:text-graphite-200"
        >
          →
        </button>
      </div>

      <div
        ref={scrollerRef}
        onScroll={updateArrows}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto py-2 [scrollbar-width:none] md:gap-7 [&::-webkit-scrollbar]:hidden"
      >
        {PORTFOLIO.map((it, i) => (
          <button
            key={it.slug}
            type="button"
            className="group w-[72%] shrink-0 cursor-pointer snap-start text-left focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[5px] sm:w-[46%] md:w-[calc((100%-56px)/3)]"
            onClick={() => {
              setOpen(i);
              setPage(0);
            }}
          >
            <div className="relative aspect-[707/1000] overflow-hidden rounded-lg border border-graphite-600 shadow-[0_18px_40px_rgba(0,0,0,0.4)] transition-[transform,border-color] duration-300 group-hover:-translate-y-1.5 group-hover:border-graphite-300">
              <Image
                src={pageSrc(it.slug, PAGES[0])}
                alt={`Capa — ${it.nome}, ${it.peca}`}
                fill
                sizes="(min-width: 768px) 30vw, 45vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-bold text-graphite-100">
                {it.nome}
              </span>
              <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-400 transition-colors group-hover:text-graphite-200">
                FOLHEAR ↗
              </span>
            </div>
            <div className="mt-1 font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-400">
              {String(i + 1).padStart(2, "0")} · {it.segmento.toUpperCase()} ·{" "}
              {it.paginas} PÁG
            </div>
          </button>
        ))}
      </div>

      {/* Folheador */}
      {item && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${item.nome} — ${item.peca}`}
          className="fixed inset-0 z-50 flex flex-col bg-graphite-950/95 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          {/* Topo do folheador */}
          <div
            className="flex items-center justify-between px-[clamp(20px,5vw,64px)] py-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <span className="block truncate text-[15px] font-bold text-graphite-100">
                {item.nome}
              </span>
              <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-400">
                {item.peca.toUpperCase()} · {item.segmento.toUpperCase()}
              </span>
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              className="cursor-pointer rounded px-3 py-2 font-mono text-xs font-medium tracking-[0.18em] text-graphite-300 transition-colors hover:text-graphite-100 focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]"
            >
              FECHAR ✕
            </button>
          </div>

          {/* Página */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-16">
            <Image
              key={page}
              src={pageSrc(item.slug, PAGES[page])}
              alt={`${item.nome} — página ${PAGES[page].replace(/\D/g, "")}`}
              width={1000}
              height={1414}
              priority
              className="h-full w-auto rounded-md object-contain shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              onClick={(e) => e.stopPropagation()}
            />
            {page > 0 && (
              <button
                type="button"
                aria-label="Página anterior"
                className="absolute left-[clamp(12px,3vw,40px)] cursor-pointer rounded-lg border border-graphite-600 px-4 py-3 text-graphite-200 transition-colors hover:border-graphite-300 hover:text-graphite-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setPage((p) => p - 1);
                }}
              >
                ←
              </button>
            )}
            {page < PAGES.length - 1 && (
              <button
                type="button"
                aria-label="Próxima página"
                className="absolute right-[clamp(12px,3vw,40px)] cursor-pointer rounded-lg border border-graphite-600 px-4 py-3 text-graphite-200 transition-colors hover:border-graphite-300 hover:text-graphite-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setPage((p) => p + 1);
                }}
              >
                →
              </button>
            )}
          </div>

          {/* Contador */}
          <div
            className="py-5 text-center font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-400"
            onClick={(e) => e.stopPropagation()}
          >
            {String(page + 1).padStart(2, "0")} /{" "}
            {String(PAGES.length).padStart(2, "0")}
          </div>
        </div>
      )}
    </>
  );
}
