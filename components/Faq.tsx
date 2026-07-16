"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "Qual é o prazo médio de entrega?",
    a: "O Essencial fica pronto em até 7 dias úteis; o Completo, em até 15. Projetos sob medida têm cronograma combinado no início: você sabe a data antes de fechar.",
  },
  {
    q: "O que eu preciso enviar?",
    a: "A lista de produtos (nome, descrição curta e preço) e as fotos que você já tem. Se as fotos precisarem de ajuste, a gente avisa antes de começar. Uma planilha simples resolve.",
  },
  {
    q: "Como funcionam as revisões e os ajustes?",
    a: "Antes da entrega, você aponta os ajustes da primeira versão em uma lista única: troca de fotos, textos e ordem de páginas. Depois da entrega, vale a garantia de ajustes do seu plano. Durante o período, você pede mudanças no catálogo (trocar produtos, atualizar preços, incluir tags de desconto) sem custo; encerrado o período, ajustes são contratados como nova encomenda.",
  },
  {
    q: "Em quais formatos o catálogo é entregue?",
    a: "Em PDF de alta resolução, um único arquivo que funciona no WhatsApp, no e-mail e na gráfica. No Sob medida também entregamos os arquivos abertos.",
  },
  {
    q: "Vocês entregam impresso?",
    a: "Sim. Além do PDF, você pode encomendar a versão impressa por um valor adicional, orçado conforme quantidade, papel e acabamento. A gente cuida da gráfica e você recebe os catálogos prontos.",
  },
];

export default function Faq() {
  // primeira pergunta aberta por padrão
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col">
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-graphite-800">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-5 border-none bg-transparent px-1 py-[22px] text-left font-sans text-[17px] font-medium text-graphite-100 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-graphite-200 focus-visible:-outline-offset-2"
            >
              <span>{item.q}</span>
              <span className="shrink-0 font-mono text-sm text-graphite-400">
                {isOpen ? "—" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="m-0 pb-6 pl-1 pr-10 text-[15px] leading-[1.6] text-graphite-200 text-pretty">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
