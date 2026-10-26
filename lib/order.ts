/* Encomenda: opções do formulário e montagem do link de WhatsApp.
   Sem backend — o pedido vira uma mensagem pré-preenchida no zap. */

// Número real da Catana (formato: 55 + DDD + número)
export const WHATSAPP_NUMBER = "5555991333502";

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

export function buildWhatsAppMessage(d: OrderData): string {
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
  return linhas.join("\n");
}

export function buildWhatsAppUrl(d: OrderData): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppMessage(d),
  )}`;
}

/* ---- Envio por e-mail ---------------------------------------------------
   O pedido vai para o backend (Django) por mesma-origem: /api/ no apex é
   proxy para o backend, então não há CORS nem chave exposta no navegador.
   O WhatsApp continua sendo o caminho principal; o e-mail é a rede de
   segurança para quando a pessoa fecha o zap sem enviar. */

/* Onde o pedido e entregue.

   No apex o nginx faz proxy de /api/ para o Django, entao a mesma origem
   resolve. Fora do apex (preview da Vercel, por exemplo) esse proxy nao
   existe: o POST iria para um 404. Nesses casos apontamos para o apex, que
   responde com CORS liberado para as origens conhecidas.

   NEXT_PUBLIC_ORDER_ENDPOINT tem a palavra final, quando definido. */
const APEX = "https://usecatana.com.br";
const ORDER_PATH = "/api/public/order-request/";
const HOSTS_COM_PROXY = new Set(["usecatana.com.br", "www.usecatana.com.br"]);

export function orderEndpoint(): string {
  const override = process.env.NEXT_PUBLIC_ORDER_ENDPOINT;
  if (override) return override;
  if (typeof window === "undefined") return ORDER_PATH;
  return HOSTS_COM_PROXY.has(window.location.hostname)
    ? ORDER_PATH
    : `${APEX}${ORDER_PATH}`;
}

export type OrderPayload = {
  empresa: string;
  segmento: string;
  plano: string;
  produtos: string;
  instagram?: string;
  email?: string;
  impressao: boolean;
  /** Armadilha para bot: humano não vê, robô preenche. */
  website: string;
  /** Tempo entre abrir o formulário e enviar, em ms. */
  elapsed_ms: number;
};

export function buildOrderPayload(
  d: OrderData,
  hid: { website: string; elapsedMs: number },
): OrderPayload {
  return {
    empresa: d.empresa,
    segmento: d.segmento,
    plano: d.plano,
    produtos: d.produtos,
    instagram: d.instagram,
    email: d.email,
    impressao: d.impresso,
    website: hid.website,
    elapsed_ms: Math.max(0, Math.round(hid.elapsedMs)),
  };
}

/** Dispara o e-mail. Nunca lança: o formulário não pode travar por causa disso. */
export async function submitOrder(
  payload: OrderPayload,
  timeoutMs = 3000,
): Promise<boolean> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), timeoutMs);
  try {
    const resposta = await fetch(orderEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controle.signal,
      keepalive: true,
    });
    if (!resposta.ok && resposta.status !== 202) return false;
    const corpo = await resposta.json().catch(() => null);
    // O backend confirma o recebimento (202) e envia em segundo plano; a
    // chave `enviado` ficou como compatibilidade com respostas antigas.
    return Boolean(corpo?.recebido ?? corpo?.enviado);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
