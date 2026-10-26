"use client";

import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import {
  FAIXAS_PRODUTOS,
  PLANO_INDICACAO,
  PLANOS,
  SEGMENTOS,
  buildOrderPayload,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  submitOrder,
  type OrderData,
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
  // Guarda o pedido já montado: se o navegador interno bloquear a
  // navegação, o visitante ainda tem o link e o texto para copiar.
  const [pedido, setPedido] = useState<{ url: string; texto: string } | null>(
    null,
  );
  const [copiado, setCopiado] = useState(false);
  // Momento em que o modal abriu: usado para descartar envio de bot.
  const [abertoEm, setAbertoEm] = useState(0);

  // Abre quando qualquer OrderButton dispara o evento
  useEffect(() => {
    const onOrder = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setPlano(detail || PLANO_INDICACAO);
      setPedido(null);
      setCopiado(false);
      setAbertoEm(Date.now());
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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const dados: OrderData = {
      empresa: String(f.get("empresa") ?? "").trim(),
      segmento: String(f.get("segmento") ?? ""),
      plano: String(f.get("plano") ?? ""),
      produtos: String(f.get("produtos") ?? ""),
      instagram: String(f.get("instagram") ?? "").trim() || undefined,
      email: String(f.get("email") ?? "").trim() || undefined,
      impresso: f.get("impresso") === "on",
    };
    const url = buildWhatsAppUrl(dados);
    setPedido({ url, texto: buildWhatsAppMessage(dados) });
    setCopiado(false);

    // O e-mail sai primeiro, mas nunca segura o fluxo: 1,5 s de teto. No caso
    // normal volta em ~200 ms; se o backend demorar ou falhar, o WhatsApp abre
    // igual e o pedido não se perde — só deixa de chegar por e-mail.
    await submitOrder(
      buildOrderPayload(dados, {
        website: String(f.get("website") ?? ""),
        elapsedMs: abertoEm ? Date.now() - abertoEm : 0,
      }),
    );

    // Navegação direta em vez de window.open: o popup é bloqueado com
    // frequência no navegador interno do Instagram. O modal continua
    // aberto com o link e o texto como plano B.
    window.location.href = url;
  };

  const copiar = async () => {
    if (!pedido) return;
    try {
      await navigator.clipboard.writeText(pedido.texto);
      setCopiado(true);
    } catch {
      // clipboard indisponível: o texto fica visível para seleção manual
    }
  };

  const fechar = () => {
    setPedido(null);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Encomendar catálogo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-950/90 p-5 backdrop-blur-sm"
      onClick={fechar}
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
            onClick={fechar}
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

        {pedido && (
          <div className="mb-7 rounded-lg border border-graphite-600 bg-graphite-950 p-4">
            <p className="m-0 mb-3 text-[13px] leading-normal text-graphite-200">
              Se o WhatsApp não abrir, use um dos caminhos abaixo — o pedido já
              está pronto.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={pedido.url}
                target="_blank"
                rel="noopener"
                className="rounded-md border border-graphite-100 bg-graphite-100 px-4 py-2 font-sans text-[13px] font-bold text-graphite-950 no-underline"
              >
                Abrir o WhatsApp
              </a>
              <button
                type="button"
                onClick={copiar}
                className="cursor-pointer rounded-md border border-graphite-600 bg-transparent px-4 py-2 font-sans text-[13px] font-medium text-graphite-100"
              >
                {copiado ? "Pedido copiado" : "Copiar pedido"}
              </button>
            </div>
            <pre className="custom-scroll mt-3 max-h-32 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-graphite-300">
              {pedido.texto}
            </pre>
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-5">
          {/* Armadilha para bots. Fica fora da tela e fora da tabulação;
              humano não chega aqui, robô preenche tudo. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="ord-website">Não preencher</label>
            <input id="ord-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
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
            VAI POR E-MAIL E ABRE O WHATSAPP
          </p>
        </form>
      </div>
    </div>
  );
}
