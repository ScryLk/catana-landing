"use client";

import { useEffect, useState } from "react";
import Signature from "@/components/Signature";

/* Intro estilo assinatura: "catana" é desenhado à mão numa cortina
   escura, que depois sobe revelando a página. Timings vivem no CSS
   (globals.css, seção "Intro"); aqui só controlamos o desmonte. */
export default function IntroOverlay() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Com movimento reduzido, pula a intro por completo.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHidden(true);
      return;
    }
    // Trava o scroll enquanto a cortina está na tela.
    document.documentElement.style.overflow = "hidden";
    // Rede de segurança caso o animationend não dispare.
    const fallback = window.setTimeout(() => setHidden(true), 4500);
    return () => {
      document.documentElement.style.overflow = "";
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (hidden) document.documentElement.style.overflow = "";
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="intro-overlay fixed inset-0 z-50 flex items-center justify-center bg-graphite-950"
      onAnimationEnd={(e) => {
        if (e.animationName === "introExit") setHidden(true);
      }}
    >
      <Signature animated className="w-[min(72vw,560px)] text-graphite-100" />
    </div>
  );
}
