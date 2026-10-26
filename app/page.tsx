import type { Metadata } from "next";
import { Fragment } from "react";
import CoverShelf from "@/components/CoverShelf";
import Faq from "@/components/Faq";
import HeroMarginalia from "@/components/HeroMarginalia";
import IntroOverlay from "@/components/IntroOverlay";
import OrderButton from "@/components/OrderButton";
import OrderModal from "@/components/OrderModal";
import PortfolioGallery from "@/components/PortfolioGallery";
import Signature from "@/components/Signature";
import { LOTE, PAGAMENTO, PRECOS } from "@/lib/pricing";
import { WHATSAPP_NUMBER } from "@/lib/order";

export const metadata: Metadata = {
  title: "Catana",
  description:
    "Três formatos de encomenda, do enxuto ao completo. Todos entregues em PDF, prontos para enviar e imprimir.",
};

/* ===== Estilos compartilhados ===== */
const PAD_X = "px-[clamp(20px,5vw,64px)]";
const MONO_11 =
  "font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-300";
const BTN_PRIMARY =
  "cursor-pointer rounded-lg border border-graphite-100 bg-graphite-100 font-sans font-bold text-graphite-950 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]";
const BTN_SECONDARY =
  "cursor-pointer rounded-lg border border-graphite-600 bg-transparent font-sans font-medium text-graphite-100 transition-colors hover:border-graphite-300 focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]";

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="whitespace-nowrap font-mono text-xs font-medium tracking-[0.18em] text-graphite-300">
        {label}
      </span>
      <span className="h-px flex-1 bg-graphite-600" />
    </div>
  );
}

/* Linha de especificação do plano — números em formato de ficha
   técnica, ecoando a marginalia da capa */
function PlanSpecs({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 border-y border-graphite-600/60 py-3 font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-300">
      {children}
    </div>
  );
}

function PlanItem({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <li className="flex items-baseline gap-3 text-[15px] leading-normal text-graphite-200 [&_strong]:font-medium [&_strong]:text-graphite-100">
      {/* marcador quadradinho — eco da malha de células */}
      <span
        className={`h-2 w-2 shrink-0 translate-y-px rounded-sm ${
          light ? "bg-graphite-100" : "bg-graphite-400"
        }`}
      />
      <span>{children}</span>
    </li>
  );
}

const COMPARACAO: [string, string, string, string][] = [
  ["Páginas", "Até 8", "Até 16", "Conforme escopo"],
  ["Prazo", "7 dias úteis", "15 dias úteis", "A combinar"],
  ["Garantia de ajustes", "3 meses", "12 meses", "Conforme contrato"],
];

/* Mesma ordem das colunas da tabela — usada nos rótulos da versão empilhada,
   para que as duas leituras nunca saiam de sincronia. */
const PLANOS_COMPARADOS = ["Essencial", "Completo", "Sob medida"];

export default function Precificacao() {
  return (
    <div className="min-h-screen bg-graphite-950 text-graphite-100">
      <IntroOverlay />
      <OrderModal />

      {/* Capa do catálogo: header + hero emoldurados pela marginalia
          de gráfica, sobre a malha de diagramação */}
      <div className="relative">
        <div aria-hidden className="hero-grid absolute inset-0 z-0" />
        <div aria-hidden className="hero-glow absolute inset-0 z-0" />
        <HeroMarginalia />

        {/* Topo */}
        <header
          className={`hero-reveal relative z-[3] flex items-center justify-between py-6 ${PAD_X}`}
          style={{ "--reveal": "3.4s" } as React.CSSProperties}
        >
          {/* Marca do topo: só a assinatura, sem o "#" ao lado */}
          <Signature label="catana" className="block w-[74px] text-graphite-200" />
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener"
            className="px-1 py-2 font-mono text-xs font-medium tracking-[0.18em] text-graphite-300 no-underline transition-colors hover:text-graphite-200 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]"
          >
            FALAR NO WHATSAPP ↗
          </a>
        </header>

        {/* Hero */}
        <section
          className={`relative overflow-hidden pt-[clamp(48px,8vw,96px)] pb-[clamp(72px,10vw,120px)] ${PAD_X}`}
        >
          <div className="relative z-[2] mx-auto flex max-w-[880px] flex-col items-center text-center">
            {/* Assinatura do estúdio — a mesma desenhada na intro */}
            <Signature
              label="catana"
              className="hero-reveal mb-8 w-[min(64vw,380px)] text-graphite-100"
              style={{ "--reveal": "3.1s" } as React.CSSProperties}
            />
            <h1
              className="hero-reveal m-0 mb-[60px] text-[clamp(20px,2.6vw,27px)] font-medium leading-[1.25] tracking-[-0.01em] text-graphite-200 text-balance"
              style={{ "--reveal": "3.2s" } as React.CSSProperties}
            >
              Catálogos profissionais, feitos sob encomenda.
            </h1>
            <div
              className="hero-reveal flex flex-wrap justify-center gap-4"
              style={{ "--reveal": "3.3s" } as React.CSSProperties}
            >
              <OrderButton className={`${BTN_PRIMARY} px-7 py-4 text-[15px]`}>
                Encomendar meu catálogo
              </OrderButton>
              <a
                href="#exemplos"
                className={`${BTN_SECONDARY} inline-block px-7 py-4 text-[15px] no-underline`}
              >
                Ver exemplos
              </a>
            </div>
          </div>

          {/* Estante de catálogos: do rascunho escuro ao branco final */}
          <CoverShelf />
        </section>
      </div>

      {/* Portfólio */}
      <section
        id="exemplos"
        className={`scroll-mt-6 bg-graphite-900 py-[clamp(36px,5vw,64px)] ${PAD_X}`}
      >
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow label="CAT—04.1 · EXEMPLOS" />
          <PortfolioGallery />
        </div>
      </section>

      {/* Planos */}
      <section className={`bg-graphite-950 py-[clamp(56px,8vw,96px)] ${PAD_X}`}>
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow label="CAT—04.2 · FORMATOS" />

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-stretch gap-5">
            {/* Essencial */}
            <div className="flex flex-col rounded-xl border border-graphite-600 bg-graphite-900 px-7 py-8 transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-graphite-400">
              <div className="mb-1.5 text-lg font-bold text-graphite-100">
                Essencial
              </div>
              <p className="m-0 mb-[18px] text-[13px] leading-normal text-graphite-300 text-pretty">
                Para o pequeno negócio que precisa de um catálogo apresentável,
                rápido.
              </p>
              <div className="mb-1 flex items-baseline gap-2.5">
                <span className="text-[40px] font-extrabold tracking-[-0.02em] text-graphite-100">
                  {PRECOS.essencial}
                </span>
                <span className="text-[15px] text-graphite-400 line-through">
                  {PRECOS.essencialTabela}
                </span>
              </div>
              <div className={`${MONO_11} mb-1.5`}>
                {LOTE.nome.toUpperCase()} · {LOTE.vagas} VAGAS · ATÉ {LOTE.prazo}
              </div>
              <p className="m-0 mb-[26px] text-[12px] leading-normal text-graphite-300 text-pretty">
                Em troca, um {LOTE.contrapartida}.
              </p>
              <PlanSpecs>8 PÁGINAS · 7 DIAS ÚTEIS</PlanSpecs>
              <ul className="m-0 mb-8 flex flex-1 list-none flex-col gap-3 p-0">
                <PlanItem>
                  Estilo escolhido da biblioteca Catana
                </PlanItem>
                <PlanItem>
                  Diagramação profissional, da capa aos preços
                </PlanItem>
                <PlanItem>PDF pronto para WhatsApp, e-mail e gráfica</PlanItem>
              </ul>
              <OrderButton
                plano="Essencial"
                className={`${BTN_SECONDARY} w-full px-5 py-3.5 text-[15px]`}
              >
                Encomendar Essencial
              </OrderButton>
              <p className="m-0 mt-3 text-center font-mono text-[10px] font-medium tracking-[0.16em] text-graphite-400">
                {PAGAMENTO.toUpperCase()}
              </p>
            </div>

            {/* Completo */}
            <div className="relative flex flex-col rounded-xl border border-graphite-300 bg-graphite-850 px-7 py-8 transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-graphite-200">
              <div className="absolute -top-[11px] left-7 rounded bg-graphite-100 px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-950">
                MAIS PEDIDO
              </div>
              <div className="mb-1.5 text-lg font-bold text-graphite-100">
                Completo
              </div>
              <p className="m-0 mb-[18px] text-[13px] leading-normal text-graphite-300 text-pretty">
                Para quem já tem marca rodando e quer um catálogo com cara de
                agência.
              </p>
              <div className="mb-1 flex items-baseline gap-2.5">
                <span className="text-[40px] font-extrabold tracking-[-0.02em] text-graphite-100">
                  {PRECOS.completo}
                </span>
                <span className="text-[15px] text-graphite-400 line-through">
                  {PRECOS.completoTabela}
                </span>
              </div>
              <div className={`${MONO_11} mb-[26px]`}>
                TUDO DO ESSENCIAL, E MAIS:
              </div>
              <PlanSpecs>16 PÁGINAS · 15 DIAS ÚTEIS</PlanSpecs>
              <ul className="m-0 mb-8 flex flex-1 list-none flex-col gap-3 p-0">
                <PlanItem light>
                  <strong>Visual ajustado às cores e à logo da sua marca</strong>
                </PlanItem>
                <PlanItem light>
                  Descrições específicas do seu segmento
                </PlanItem>
                <PlanItem light>
                  Capa, contracapa e página de apresentação
                </PlanItem>
              </ul>
              <OrderButton
                plano="Completo"
                className={`${BTN_PRIMARY} w-full px-5 py-3.5 text-[15px]`}
              >
                Encomendar Completo
              </OrderButton>
              <p className="m-0 mt-3 text-center font-mono text-[10px] font-medium tracking-[0.16em] text-graphite-400">
                {PAGAMENTO.toUpperCase()}
              </p>
            </div>

            {/* Sob medida */}
            <div className="flex flex-col rounded-xl border border-graphite-600 bg-graphite-900 px-7 py-8 transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-graphite-400">
              <div className="mb-1.5 text-lg font-bold text-graphite-100">
                Sob medida
              </div>
              <p className="m-0 mb-[18px] text-[13px] leading-normal text-graphite-300 text-pretty">
                Para redes e operações com volume e recorrência.
              </p>
              <div className="mb-1 text-[40px] font-extrabold tracking-[-0.02em] text-graphite-100">
                Sob consulta
              </div>
              <div className={`${MONO_11} mb-[26px]`}>
                PRECIFICADO POR PROPOSTA
              </div>
              <PlanSpecs>ESCOPO LIVRE · PRAZO A COMBINAR</PlanSpecs>
              <ul className="m-0 mb-8 flex flex-1 list-none flex-col gap-3 p-0">
                <PlanItem>Catálogos acima de 16 páginas</PlanItem>
                <PlanItem>
                  Múltiplas linhas e versões do catálogo
                </PlanItem>
                <PlanItem>
                  Atualização periódica: ofertas, sazonal, coleção
                </PlanItem>
              </ul>
              <OrderButton
                plano="Sob medida"
                className={`${BTN_SECONDARY} w-full px-5 py-3.5 text-[15px]`}
              >
                Falar com a gente
              </OrderButton>
            </div>
          </div>

          {/* Detalhes completos moram na tabela, não nos cards */}
          <div className="mt-9 text-center">
            <a
              href="#comparacao"
              className="font-mono text-xs font-medium tracking-[0.18em] text-graphite-300 no-underline transition-colors hover:text-graphite-200 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]"
            >
              COMPARAÇÃO COMPLETA ↓
            </a>
          </div>
        </div>
      </section>

      {/* Comparação */}
      <section
        id="comparacao"
        className={`scroll-mt-6 bg-graphite-900 py-[clamp(56px,8vw,96px)] ${PAD_X}`}
      >
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow label="CAT—04.3 · COMPARAÇÃO" />

          {/* No celular quatro colunas não cabem: a tabela era mais larga que a
              tela e empurrava "Completo" — justamente o plano mais vendido —
              para fora, sem nenhuma pista de que havia rolagem lateral. Abaixo
              de sm a comparação vira uma ficha por critério, com o nome do
              plano ao lado de cada valor. */}
          <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:hidden">
            {COMPARACAO.map(([label, ...cols]) => (
              <li
                key={label}
                className="rounded-lg border border-graphite-600 bg-graphite-950/40 px-4 py-3.5"
              >
                <div className="mb-2 font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-300">
                  {label.toUpperCase()}
                </div>
                <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                  {cols.map((col, i) => (
                    <Fragment key={PLANOS_COMPARADOS[i]}>
                      <dt className="text-[13px] text-graphite-400">
                        {PLANOS_COMPARADOS[i]}
                      </dt>
                      <dd className="m-0 text-[14px] text-graphite-200">
                        {col}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] border-collapse text-sm text-graphite-200">
              <thead>
                <tr>
                  <th className="border-b border-graphite-600 py-3 pr-4 pl-0" />
                  <th className="border-b border-graphite-600 px-4 py-3 text-left text-[15px] font-bold text-graphite-100">
                    Essencial
                  </th>
                  <th className="border-b border-graphite-600 px-4 py-3 text-left text-[15px] font-bold text-graphite-100">
                    Completo
                  </th>
                  <th className="border-b border-graphite-600 px-4 py-3 text-left text-[15px] font-bold text-graphite-100">
                    Sob medida
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARACAO.map(([label, ...cols]) => (
                  <tr key={label}>
                    <td className="border-b border-graphite-800 py-3.5 pr-4 pl-0 text-graphite-300">
                      {label}
                    </td>
                    {cols.map((col, i) => (
                      <td
                        key={i}
                        className="border-b border-graphite-800 px-4 py-3.5"
                      >
                        {col}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* O que a garantia de ajustes cobre */}
          <p className="m-0 mt-6 max-w-[720px] text-[13px] leading-normal text-graphite-300 text-pretty">
            <strong className="font-medium text-graphite-200">
              Garantia de ajustes:
            </strong>{" "}
            durante o período, você pede alterações no catálogo entregue:
            trocar ou adicionar produtos, atualizar preços, incluir tags de
            desconto e ofertas. Encerrado o período, os ajustes passam a ser
            contratados como uma nova encomenda.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className={`bg-graphite-950 py-[clamp(56px,8vw,96px)] ${PAD_X}`}>
        <div className="mx-auto max-w-[760px]">
          <Eyebrow label="CAT—04.4 · PERGUNTAS" />
          <Faq />
        </div>
      </section>

      {/* CTA final */}
      <section
        className={`bg-graphite-850 py-[clamp(64px,10vw,120px)] text-center ${PAD_X}`}
      >
        <h2 className="m-0 mb-4 text-[clamp(26px,4vw,40px)] font-extrabold tracking-[-0.02em] text-graphite-100">
          Não sabe qual escolher? A gente ajuda.
        </h2>
        <p className="m-0 mb-8 text-base text-graphite-200">
          Conta o que você vende e quantos produtos tem. A gente indica o
          formato certo.
        </p>
        <OrderButton className={`${BTN_PRIMARY} px-8 py-4 text-base`}>
          Pedir orçamento
        </OrderButton>
      </section>

      {/* Rodapé */}
      <footer
        className={`flex flex-wrap items-center justify-between gap-4 border-t border-graphite-800 py-7 font-mono text-[11px] font-medium tracking-[0.18em] text-graphite-400 ${PAD_X}`}
      >
        <span>CATANA © 2026</span>
        <span>CATÁLOGOS SOB ENCOMENDA</span>
      </footer>
    </div>
  );
}
