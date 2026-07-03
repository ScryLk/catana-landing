// Estante de catálogos do hero: 13 capas sobrepostas interpolando do
// quase-preto ao branco, esquerda → direita — "do rascunho ao resultado final".
const N = 13;
const ROTS = [-2.5, 1.5, -1, 2, -2, 1, -1.5, 2.5, -1, 1.5, -2, 1, -1.5];
const LIFTS = [6, 0, 8, 2, 10, 4, 0, 8, 3, 9, 1, 6, 0];

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

export default function CoverShelf() {
  return (
    <div
      aria-hidden="true"
      className="relative z-[1] mt-[clamp(64px,9vw,120px)] -mb-[60px] flex items-end justify-center pt-10"
    >
      {Array.from({ length: N }, (_, i) => {
        const t = i / (N - 1);
        const bg = `rgb(${lerp(26, 255, t)},${lerp(26, 255, t)},${lerp(30, 255, t)})`;
        const line =
          t < 0.5 ? "rgba(255,255,255,0.30)" : "rgba(19,19,21,0.22)";
        return (
          <div
            key={i}
            className="catalog-cover h-[150px] w-[104px] shrink-0 rounded-[6px_10px_10px_6px] px-3.5 py-[18px] shadow-[-10px_4px_22px_rgba(0,0,0,0.38)] first:ml-0 -ml-[34px]"
            style={
              {
                background: bg,
                zIndex: i + 1,
                "--rot": `${ROTS[i]}deg`,
                "--lift": `${LIFTS[i]}px`,
                "--delay": `${(0.08 * i).toFixed(2)}s`,
              } as React.CSSProperties
            }
          >
            <div className="flex flex-col gap-[7px]">
              <span
                className="block h-[5px] w-[62%] rounded-sm"
                style={{ background: line }}
              />
              <span
                className="block h-[5px] w-[44%] rounded-sm"
                style={{ background: line }}
              />
              <span
                className="block h-[5px] w-[52%] rounded-sm"
                style={{ background: line }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
