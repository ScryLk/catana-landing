"use client";

/* Gatilho da encomenda: qualquer botão da página dispara o evento com
   o plano pré-selecionado; o OrderModal (montado uma vez) escuta. */
export default function OrderButton({
  plano,
  className,
  children,
}: {
  plano?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("catana:order", { detail: plano ?? "" }),
        )
      }
    >
      {children}
    </button>
  );
}
