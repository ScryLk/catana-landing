/* Assinatura cursiva "catana": traço contínuo único + corte do t.
   Usada pela intro (animada, desenhando) e pelo hero (estática, como
   carimbo do estúdio). A cor vem de `currentColor`. */
export default function Signature({
  className,
  animated = false,
  label,
  style,
}: {
  className?: string;
  animated?: boolean;
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="40 10 640 170"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {/* Traço contínuo da assinatura */}
      <path
        className={animated ? "intro-stroke intro-stroke-main" : undefined}
        pathLength={1}
        d="M 132 96
           C 124 82 104 76 88 86 C 70 97 62 122 74 138
           C 84 150 104 148 116 136 C 128 148 146 142 158 120
           C 170 100 190 90 206 90 C 194 78 172 80 160 94
           C 148 108 148 128 160 140 C 170 149 186 145 196 132
           C 202 124 206 108 208 92 C 206 112 206 130 214 142
           C 222 152 236 146 244 128 C 256 102 270 66 282 44
           C 280 70 276 110 278 132 C 280 148 294 152 308 138
           C 322 124 344 100 384 90 C 370 78 348 80 336 94
           C 324 108 324 128 336 140 C 346 149 362 145 372 132
           C 378 124 382 108 384 92 C 382 112 382 130 390 142
           C 398 152 412 146 420 128 C 428 110 438 96 446 88
           C 448 106 446 128 448 142 C 458 116 472 94 486 88
           C 494 84 498 92 498 104 C 498 120 496 132 502 142
           C 508 150 520 146 528 128 C 536 112 560 92 592 90
           C 578 78 556 80 544 94 C 532 108 532 128 544 140
           C 554 149 570 145 580 132 C 586 124 590 108 592 92
           C 590 112 590 130 598 142 C 608 154 626 148 640 124"
      />
      {/* Corte do "t", desenhado por último */}
      <path
        className={animated ? "intro-stroke intro-stroke-cross" : undefined}
        pathLength={1}
        d="M 250 76 C 272 68 300 64 328 70"
      />
    </svg>
  );
}
