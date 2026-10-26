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
   Logo, fotos e lista de produtos chegam depois, pelo WhatsApp.

   Fluxo em dois tempos: o pedido sai por e-mail ao enviar, e o WhatsApp vira
   um convite na tela seguinte, não um redirecionamento automático. Quem tem
   outro número, está sem WhatsApp Web ou não está logado não fica barrado. */

const LABEL =
  "mb-1 block font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-300 sm:mb-2";
const FIELD =
  "w-full rounded-lg border border-graphite-600 bg-graphite-950 px-4 py-2.5 font-sans text-[15px] text-graphite-100 placeholder:text-graphite-400 focus:border-graphite-300 focus:outline-none sm:py-3";

/* Selo de estado: verde para confirmado, vermelho para falha.

   Centralizado e com respiro próprio, porque funciona como a marca do
   desfecho — não como detalhe do texto. O círculo entra com um leve pop e o
   traço se desenha em seguida. Tudo em SVG inline, sem fonte de ícone nem
   emoji, que renderiza diferente em cada sistema. Respeita quem pediu menos
   movimento no sistema operacional. */
function Selo({ estado }: { estado: "ok" | "erro" }) {
  const ok = estado === "ok";
  const cor = ok ? "#3fb950" : "#f85149";
  const fundo = ok ? "rgba(63,185,80,0.12)" : "rgba(248,81,73,0.12)";
  return (
    <>
      <style>{`
        @keyframes selo-pop {
          0%   { opacity: 0; transform: scale(0.62); }
          60%  { opacity: 1; transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes selo-traco {
          to { stroke-dashoffset: 0; }
        }
        .selo-circulo {
          animation: selo-pop 420ms cubic-bezier(0.2, 0.8, 0.3, 1.15) both;
        }
        .selo-traco {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: selo-traco 340ms 200ms ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .selo-circulo { animation: none; }
          .selo-traco { stroke-dashoffset: 0; animation: none; }
        }
      `}</style>
      <span
        aria-hidden="true"
        className="selo-circulo mx-auto my-6 flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: fundo, border: `1px solid ${cor}` }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={cor}
             strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {ok ? (
            <path className="selo-traco" d="M4 10.5 8 14.5 16 5.5" />
          ) : (
            <>
              <path className="selo-traco" d="M5.5 5.5l9 9" />
              <path className="selo-traco" style={{ animationDelay: "300ms" }} d="M14.5 5.5l-9 9" />
            </>
          )}
        </svg>
      </span>
    </>
  );
}

export default function OrderModal() {
  const [open, setOpen] = useState(false);
  const [plano, setPlano] = useState<string>(PLANO_INDICACAO);
  // Pedido já montado: usado tanto para o convite do WhatsApp quanto para o
  // botão de copiar, caso o cliente prefira colar ele mesmo.
  const [pedido, setPedido] = useState<{ url: string; texto: string } | null>(
    null,
  );
  // null = ainda preenchendo; true/false = e-mail saiu ou não.
  const [enviado, setEnviado] = useState<boolean | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  // Momento em que o modal abriu: usado para descartar envio de bot.
  const [abertoEm, setAbertoEm] = useState(0);

  // Abre quando qualquer OrderButton dispara o evento
  useEffect(() => {
    const onOrder = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setPlano(detail || PLANO_INDICACAO);
      setPedido(null);
      setEnviado(null);
      setCopiado(false);
      setEnviando(false);
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

    setPedido({ url: buildWhatsAppUrl(dados), texto: buildWhatsAppMessage(dados) });
    setCopiado(false);
    setEnviando(true);

    // Só o e-mail acontece aqui. O WhatsApp espera a decisão do cliente na
    // tela seguinte — abrir sozinho barrava quem não usa o app no desktop.
    const ok = await submitOrder(
      buildOrderPayload(dados, {
        website: String(f.get("website") ?? ""),
        elapsedMs: abertoEm ? Date.now() - abertoEm : 0,
      }),
    );
    setEnviando(false);
    setEnviado(ok);
  };

  const copiar = async () => {
    if (!pedido) return;
    try {
      await navigator.clipboard.writeText(pedido.texto);
      setCopiado(true);
    } catch {
      // clipboard indisponível: o texto segue acessível pela seleção
    }
  };

  const fechar = () => {
    setPedido(null);
    setEnviado(null);
    setOpen(false);
  };

  const concluido = enviado !== null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Encomendar catálogo"
      className="fixed inset-0 z-50 overflow-y-auto bg-graphite-950/90 backdrop-blur-sm"
      onClick={fechar}
    >
      {/* Centraliza quando cabe e deixa a página rolar quando não cabe.
          O cartão em si nunca tem barra de rolagem própria. */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-5">
        <div
          className="w-full max-w-[560px] rounded-xl border border-graphite-600 bg-graphite-900 p-4 sm:p-9"
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
              aria-label="Fechar"
              className="cursor-pointer rounded px-2 py-1 font-mono text-xs font-medium tracking-[0.18em] text-graphite-300 transition-colors hover:text-graphite-100 focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]"
            >
              ✕
            </button>
          </div>

          {concluido ? (
            <div>
              <Selo estado={enviado ? "ok" : "erro"} />
              <h2 className="m-0 mb-2 text-center text-2xl font-extrabold tracking-[-0.02em] text-graphite-100">
                {enviado ? "Pedido recebido" : "Não foi possível enviar"}
              </h2>
              <p className="mx-auto mb-7 mt-0 max-w-[46ch] text-center text-[13px] leading-normal text-graphite-300">
                {enviado
                  ? "Recebemos seus dados e a resposta chega por e-mail. Se preferir falar agora, é só chamar no WhatsApp — a mensagem já vai preenchida."
                  : "O envio não foi confirmado. O pedido já está montado — envie pelo WhatsApp abaixo e nada se perde."}
              </p>

              <a
                href={pedido?.url ?? "#"}
                target="_blank"
                rel="noopener"
                className="block cursor-pointer rounded-lg border border-graphite-100 bg-graphite-100 px-6 py-4 text-center font-sans text-[15px] font-bold text-graphite-950 no-underline transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]"
              >
                Falar no WhatsApp →
              </a>
              <p className="m-0 mt-2 text-center font-mono text-[10px] font-medium tracking-[0.18em] text-graphite-400">
                ABRE O APP OU O WHATSAPP WEB
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-graphite-600 pt-5">
                <button
                  type="button"
                  onClick={copiar}
                  className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-medium text-graphite-300 underline-offset-4 hover:text-graphite-100 hover:underline"
                >
                  {copiado ? "Pedido copiado" : "Copiar o pedido"}
                </button>
                <button
                  type="button"
                  onClick={fechar}
                  className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-medium text-graphite-300 underline-offset-4 hover:text-graphite-100 hover:underline"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="m-0 mb-1.5 text-xl font-extrabold tracking-[-0.02em] text-graphite-100 sm:mb-2 sm:text-2xl">
                Encomendar catálogo
              </h2>
              <p className="m-0 mb-3 text-[13px] leading-normal text-graphite-300 sm:mb-6">
                Só o essencial para começar. Logo, fotos e lista de produtos
                você envia depois, direto na conversa.
              </p>

              <form onSubmit={submit} className="flex flex-col gap-2.5 sm:gap-4">
                {/* Armadilha para bots. Fica fora da tela e fora da tabulação;
                    humano não chega aqui, robô preenche tudo. */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="ord-website">Não preencher</label>
                  <input
                    id="ord-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
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

                <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label htmlFor="ord-segmento" className={LABEL}>
                      SEGMENTO
                    </label>
                    <Dropdown
                      id="ord-segmento"
                      name="segmento"
                      options={SEGMENTOS}
                    />
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

                <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4">
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
                  disabled={enviando}
                  className="cursor-pointer rounded-lg border border-graphite-100 bg-graphite-100 px-6 py-3 font-sans text-[15px] font-bold text-graphite-950 transition-colors hover:bg-white sm:py-4 focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px] disabled:cursor-wait disabled:opacity-70"
                >
                  {enviando ? "Enviando…" : "Enviar pedido →"}
                </button>
                <p className="m-0 -mt-1 text-center font-mono text-[10px] font-medium tracking-[0.18em] text-graphite-400">
                  VAI POR E-MAIL · WHATSAPP É OPCIONAL
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
