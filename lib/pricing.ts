// Preços da página de precificação — edite aqui.
export const PRECOS = {
  /** Preço do lote fundador — Essencial (8 páginas) */
  essencial: "R$ 249",
  /** Preço de tabela do Essencial (aparece riscado) */
  essencialTabela: "R$ 349",
  /** Preço do lote fundador — Completo (16 páginas) */
  completo: "R$ 449",
  /** Preço de tabela do Completo (aparece riscado) */
  completoTabela: "R$ 590",
} as const;

/* Lote fundador: preço menor em troca de prova social — depoimento,
   permissão de uso como case e uma indicação. Tem prazo e vagas,
   senão vira o preço definitivo. */
export const LOTE = {
  nome: "Lote fundador",
  vagas: 3,
  prazo: "04/11",
  contrapartida: "depoimento e permissão de uso como case",
} as const;

/** Condição de pagamento exibida junto ao botão de cada plano. */
export const PAGAMENTO = "50% para começar · 50% na aprovação";
