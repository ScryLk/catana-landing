/* Marginalia da "capa": marcas de corte de gráfica nos quatro cantos,
   folio no topo, labels verticais nas laterais, escala de cinza e marca
   de registro embaixo. Puramente decorativo — tudo aria-hidden. */

const TAG =
  "font-mono text-[10px] font-medium tracking-[0.22em] text-graphite-400";

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

/* Marca de corte: duas linhas perpendiculares que não se tocam,
   como nas guias de refile de uma prova impressa. */
function CropMark({ flip }: { flip: string }) {
  return (
    <span className={`absolute h-6 w-6 ${flip}`}>
      <span className="absolute top-[22px] left-0 h-px w-[15px] bg-graphite-600" />
      <span className="absolute top-0 left-[22px] h-[15px] w-px bg-graphite-600" />
    </span>
  );
}

export default function HeroMarginalia() {
  return (
    <div
      aria-hidden
      className="hero-reveal pointer-events-none absolute inset-0 z-[2] hidden md:block"
      style={{ "--reveal": "3.5s" } as React.CSSProperties}
    >
      {/* Marcas de corte */}
      <CropMark flip="left-3 top-3" />
      <CropMark flip="right-3 top-3 -scale-x-100" />
      <CropMark flip="left-3 bottom-3 -scale-y-100" />
      <CropMark flip="right-3 bottom-3 -scale-100" />

      {/* Folio, como numa página impressa */}
      <span className={`${TAG} absolute top-7 left-1/2 -translate-x-1/2`}>
        CAT—00 · CAPA
      </span>

      {/* Laterais verticais */}
      <span
        className={`${TAG} absolute top-1/2 left-7 -translate-y-1/2 [writing-mode:vertical-rl]`}
      >
        CATANA — CATÁLOGOS SOB ENCOMENDA
      </span>
      <span
        className={`${TAG} absolute top-1/2 right-7 -translate-y-1/2 [writing-mode:vertical-rl]`}
      >
        EDIÇÃO 2026 · REV. 01
      </span>

      {/* Rodapé da capa: escala de cinza + especificação de impressão */}
      <div className="absolute bottom-6 left-7 hidden items-center gap-3 lg:flex">
        <span className="flex overflow-hidden rounded-[2px]">
          {Array.from({ length: 8 }, (_, i) => {
            const t = i / 7;
            const v = lerp(26, 233, t);
            return (
              <span
                key={i}
                className="h-2.5 w-4"
                style={{ background: `rgb(${v},${v},${v + (i === 0 ? 4 : 0)})` }}
              />
            );
          })}
        </span>
        <span className={TAG}>ESCALA K 0–100</span>
      </div>
      <div className="absolute right-7 bottom-6 hidden items-center gap-3 lg:flex">
        {/* Marca de registro */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className="text-graphite-400"
        >
          <circle
            cx="7"
            cy="7"
            r="4.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="0.8" />
        </svg>
        <span className={TAG}>A4 · 210 × 297 MM · PDF/X-1A</span>
      </div>
    </div>
  );
}
