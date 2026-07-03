import type { Metadata } from "next";
import Image from "next/image";
import CoverShelf from "@/components/CoverShelf";
import Faq from "@/components/Faq";
import { PRECOS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Precificação — Catana",
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
  ["Estilo visual", "Da biblioteca Catana", "Ajustado à sua marca", "Conforme escopo"],
  ["Produtos", "Até 20", "Até 40", "Conforme escopo"],
  ["Descrições", "1 frase por produto", "2–3 frases por produto", "Conforme escopo"],
  ["Revisões", "1 rodada", "2 rodadas", "Conforme contrato"],
  ["Prazo", "7 dias úteis", "15 dias úteis", "A combinar"],
];

export default function Precificacao() {
  return (
    <div className="min-h-screen bg-graphite-950 text-graphite-100">
      {/* Topo */}
      <header
        className={`relative z-[3] flex items-center justify-between py-6 ${PAD_X}`}
      >
        <span className="text-xl font-extrabold tracking-[-0.02em] text-graphite-100">
          catana
        </span>
        <a
          href="#"
          className="px-1 py-2 font-mono text-xs font-medium tracking-[0.18em] text-graphite-300 no-underline transition-colors hover:text-graphite-200 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:outline-offset-[3px]"
        >
          ← VOLTAR
        </a>
      </header>

      {/* Hero */}
      <section
        className={`relative overflow-hidden pt-[clamp(48px,8vw,96px)] pb-[clamp(72px,10vw,120px)] ${PAD_X}`}
      >
        <div className="relative z-[2] mx-auto flex max-w-[880px] flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt=""
            width={96}
            height={96}
            priority
            className="mb-1 block"
          />
          <div className="mb-7 text-[clamp(34px,4.5vw,48px)] font-extrabold tracking-[-0.02em] text-graphite-100">
            catana
          </div>
          <h1 className="m-0 mb-[60px] text-[clamp(20px,2.6vw,27px)] font-medium leading-[1.25] tracking-[-0.01em] text-graphite-200 text-balance">
            Catálogos profissionais, feitos sob encomenda.
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button className={`${BTN_PRIMARY} px-7 py-4 text-[15px]`}>
              Encomendar meu catálogo
            </button>
            <button className={`${BTN_SECONDARY} px-7 py-4 text-[15px]`}>
              Ver exemplos
            </button>
          </div>
        </div>

        {/* Estante de catálogos: do rascunho escuro ao branco final */}
        <CoverShelf />
      </section>

      {/* Planos */}
      <section className={`bg-graphite-950 py-[clamp(56px,8vw,96px)] ${PAD_X}`}>
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow label="CAT—04.1 · FORMATOS" />

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-stretch gap-5">
            {/* Essencial */}
            <div className="flex flex-col rounded-xl border border-graphite-600 bg-graphite-900 px-7 py-8 transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-graphite-400">
              <div className="mb-1.5 text-lg font-bold text-graphite-100">
                Essencial
              </div>
              <p className="m-0 mb-[18px] text-[13px] leading-normal text-graphite-300 text-pretty">
                Para o pequeno negócio que precisa de um catálogo apresentável
                rápido — padaria, açougue, mercadinho, loja de bairro.
              </p>
              <div className="mb-1 flex items-baseline gap-2.5">
                <span className="text-[40px] font-extrabold tracking-[-0.02em] text-graphite-100">
                  {PRECOS.essencial}
                </span>
                <span className="text-[15px] text-graphite-400 line-through">
                  {PRECOS.essencialTabela}
                </span>
              </div>
              <div className={`${MONO_11} mb-[26px]`}>
                CONDIÇÃO DE LANÇAMENTO — 10 PRIMEIROS CLIENTES
              </div>
              <ul className="m-0 mb-8 flex flex-1 list-none flex-col gap-3 p-0">
                <PlanItem>Até 8 páginas, com até 20 produtos</PlanItem>
                <PlanItem>
                  Estilo visual escolhido da biblioteca Catana — do editorial
                  claro ao premium escuro
                </PlanItem>
                <PlanItem>
                  Diagramação profissional: capa, contracapa, seções por
                  categoria e preços formatados
                </PlanItem>
                <PlanItem>
                  Redação leve das descrições (1 frase por produto)
                </PlanItem>
                <PlanItem>1 rodada de revisão</PlanItem>
                <PlanItem>PDF pronto para WhatsApp, e-mail e gráfica</PlanItem>
              </ul>
              <button
                className={`${BTN_SECONDARY} w-full px-5 py-3.5 text-[15px]`}
              >
                Encomendar Essencial
              </button>
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
                Para o negócio que já tem marca rodando e quer um catálogo com
                cara de agência — restaurantes, casas de carnes, boutiques,
                atacado.
              </p>
              <div className="mb-1 text-[40px] font-extrabold tracking-[-0.02em] text-graphite-100">
                {PRECOS.completo}
              </div>
              <div className={`${MONO_11} mb-[26px]`}>
                TUDO DO ESSENCIAL, E MAIS:
              </div>
              <ul className="m-0 mb-8 flex flex-1 list-none flex-col gap-3 p-0">
                <PlanItem light>Até 16 páginas, com até 40 produtos</PlanItem>
                <PlanItem light>
                  <strong>Estilo ajustado às cores e à logo da sua marca</strong>{" "}
                  — paleta e tipografia combinando
                </PlanItem>
                <PlanItem light>
                  Capa e contracapa dedicadas + página de apresentação do
                  negócio
                </PlanItem>
                <PlanItem light>
                  Descrições com 2–3 frases por produto, específicas do seu
                  segmento
                </PlanItem>
                <PlanItem light>
                  Página de encomendas ou atacado, quando fizer sentido
                </PlanItem>
                <PlanItem light>2 rodadas de revisão</PlanItem>
                <PlanItem light>
                  PDF final com verificação página a página (cores, fontes,
                  espaçamento)
                </PlanItem>
              </ul>
              <button
                className={`${BTN_PRIMARY} w-full px-5 py-3.5 text-[15px]`}
              >
                Encomendar Completo
              </button>
            </div>

            {/* Sob medida */}
            <div className="flex flex-col rounded-xl border border-graphite-600 bg-graphite-900 px-7 py-8 transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-graphite-400">
              <div className="mb-1.5 text-lg font-bold text-graphite-100">
                Sob medida
              </div>
              <p className="m-0 mb-[18px] text-[13px] leading-normal text-graphite-300 text-pretty">
                Para volume e recorrência — redes com várias linhas de produto,
                catálogos grandes e atualização periódica.
              </p>
              <div className="mb-1 text-[40px] font-extrabold tracking-[-0.02em] text-graphite-100">
                Sob consulta
              </div>
              <div className={`${MONO_11} mb-[26px]`}>
                PRECIFICADO POR PROPOSTA
              </div>
              <ul className="m-0 mb-8 flex flex-1 list-none flex-col gap-3 p-0">
                <PlanItem>Catálogos acima de 16 páginas ou 40 produtos</PlanItem>
                <PlanItem>
                  Múltiplas linhas e versões — varejo + atacado, unidades
                  diferentes
                </PlanItem>
                <PlanItem>
                  Atualização periódica: encarte de ofertas, cardápio sazonal,
                  coleção nova
                </PlanItem>
                <PlanItem>Prazos expressos quando você precisar</PlanItem>
              </ul>
              <button
                className={`${BTN_SECONDARY} w-full px-5 py-3.5 text-[15px]`}
              >
                Falar com a gente
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparação */}
      <section className={`bg-graphite-900 py-[clamp(56px,8vw,96px)] ${PAD_X}`}>
        <div className="mx-auto max-w-[1120px]">
          <Eyebrow label="CAT—04.2 · COMPARAÇÃO" />
          <div className="overflow-x-auto">
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
        </div>
      </section>

      {/* FAQ */}
      <section className={`bg-graphite-950 py-[clamp(56px,8vw,96px)] ${PAD_X}`}>
        <div className="mx-auto max-w-[760px]">
          <Eyebrow label="CAT—04.3 · PERGUNTAS" />
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
          Conta o que você vende e quantos produtos tem — a gente indica o
          formato certo.
        </p>
        <button className={`${BTN_PRIMARY} px-8 py-4 text-base`}>
          Pedir orçamento
        </button>
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
