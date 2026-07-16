"use client";

import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import {
  FAIXAS_PRODUTOS,
  PLANO_INDICACAO,
  PLANOS,
  SEGMENTOS,
  buildWhatsAppUrl,
} from "@/lib/order";

/* Formulário de encomenda: só o que o cliente sabe de cor.
   Logo, fotos e lista de produtos chegam depois, pelo WhatsApp. */

const LABEL =
  "mb-2 block font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-300";
const FIELD =
  "w-full rounded-lg border border-graphite-600 bg-graphite-950 px-4 py-3 font-sans text-[15px] text-graphite-100 placeholder:text-graphite-400 focus:border-graphite-300 focus:outline-none";

export default function OrderModal() {
  const [open, setOpen] = useState(false);
  const [plano, setPlano] = useState<string>(PLANO_INDICACAO);

  // Abre quando qualquer OrderButton dispara o evento
  useEffect(() => {
    const onOrder = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setPlano(detail || PLANO_INDICACAO);
      setOpen(true);
    };
    window.addEventListener("catana:order", onOrder);
    return () => window.removeEventListener("catana:order", onOrder);
  }, []);

  // Esc fecha, scroll travado enquanto aberto
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const url = buildWhatsAppUrl({
      empresa: String(f.get("empresa") ?? "").trim(),
      segmento: String(f.get("segmento") ?? ""),
      plano: String(f.get("plano") ?? ""),
      produtos: String(f.get("produtos") ?? ""),
      instagram: String(f.get("instagram") ?? "").trim() || undefined,
      email: String(f.get("email") ?? "").trim() || undefined,
      impresso: f.get("impresso") === "on",
    });
    window.open(url, "_blank", "noopener");
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Encomendar catálogo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-950/90 p-5 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="custom-scroll max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-xl border border-graphite-600 bg-graphite-900 p-7 sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-400">
            CAT—05 · ENCOMENDA
          </span>
          <button
            type="button"
            autoFocus
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded px-2 py-1 font-mono text-xs font-medium tracking-[0.18em] text-graphite-300 transition-colors hover:text-graphite-100 focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]"
          >
            ✕
          </button>
        </div>
        <h2 className="m-0 mb-2 text-2xl font-extrabold tracking-[-0.02em] text-graphite-100">
          Encomendar catálogo
        </h2>
        <p className="m-0 mb-7 text-[13px] leading-normal text-graphite-300">
          Só o essencial para começar. Logo, fotos e lista de produtos você
          envia depois, direto na conversa.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="ord-empresa" className={LABEL}>
              NOME DA EMPRESA *
            </label>
            <input
              id="ord-empresa"
              name="empresa"
              required
              placeholder="Ex.: Casa Braseiro"
              className={FIELD}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ord-segmento" className={LABEL}>
                SEGMENTO
              </label>
              <Dropdown id="ord-segmento" name="segmento" options={SEGMENTOS} />
            </div>
            <div>
              <label htmlFor="ord-plano" className={LABEL}>
                PLANO
              </label>
              <Dropdown
                id="ord-plano"
                name="plano"
                options={[...PLANOS, PLANO_INDICACAO]}
                value={plano}
                onChange={setPlano}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ord-produtos" className={LABEL}>
                QUANTOS PRODUTOS?
              </label>
              <Dropdown
                id="ord-produtos"
                name="produtos"
                options={FAIXAS_PRODUTOS}
              />
            </div>
            <div>
              <label htmlFor="ord-email" className={LABEL}>
                E-MAIL (OPCIONAL)
              </label>
              <input
                id="ord-email"
                name="email"
                type="email"
                placeholder="voce@empresa.com"
                className={FIELD}
              />
            </div>
          </div>

          <div>
            <label htmlFor="ord-instagram" className={LABEL}>
              INSTAGRAM OU SITE (OPCIONAL)
            </label>
            <input
              id="ord-instagram"
              name="instagram"
              placeholder="@suaempresa"
              className={FIELD}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-[14px] text-graphite-200">
            <input
              type="checkbox"
              name="impresso"
              className="h-4 w-4 accent-[#e9e9ec]"
            />
            Quero orçamento da versão impressa também
          </label>

          <button
            type="submit"
            className="cursor-pointer rounded-lg border border-graphite-100 bg-graphite-100 px-6 py-4 font-sans text-[15px] font-bold text-graphite-950 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]"
          >
            Enviar pelo WhatsApp →
          </button>
          <p className="m-0 -mt-1 text-center font-mono text-[10px] font-medium tracking-[0.18em] text-graphite-400">
            ABRE O SEU WHATSAPP COM O PEDIDO PRONTO
          </p>
        </form>
      </div>
    </div>
  );
}
