/* Encomenda: opções do formulário e montagem do link de WhatsApp.
   Sem backend — o pedido vira uma mensagem pré-preenchida no zap. */

// TODO: trocar pelo número real da Catana (formato: 55 + DDD + número)
export const WHATSAPP_NUMBER = "5500000000000";

export const SEGMENTOS = [
  "Restaurante & alimentação",
  "Padaria & confeitaria",
  "Açougue & carnes",
  "Mercado & hortifrúti",
  "Moda & acessórios",
  "Festas & eventos",
  "Outro",
] as const;

export const PLANOS = ["Essencial", "Completo", "Sob medida"] as const;
export const PLANO_INDICACAO = "Quero uma indicação";

export const FAIXAS_PRODUTOS = [
  "Até 20",
  "De 20 a 40",
  "Mais de 40",
  "Ainda não sei",
] as const;

export type OrderData = {
  empresa: string;
  segmento: string;
  plano: string;
  produtos: string;
  instagram?: string;
  email?: string;
  impresso: boolean;
};

export function buildWhatsAppUrl(d: OrderData): string {
  const linhas = [
    "Olá! Quero encomendar um catálogo Catana.",
    "",
    `• Empresa: ${d.empresa}`,
    `• Segmento: ${d.segmento}`,
    `• Plano: ${d.plano}`,
    `• Produtos: ${d.produtos}`,
  ];
  if (d.instagram) linhas.push(`• Instagram/site: ${d.instagram}`);
  if (d.email) linhas.push(`• E-mail: ${d.email}`);
  linhas.push(`• Versão impressa: ${d.impresso ? "sim, quero orçamento" : "não"}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    linhas.join("\n"),
  )}`;
}
