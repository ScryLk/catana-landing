import type { NextConfig } from "next";

// Export estático: a landing é servida direto pelo nginx, sem processo Node.
// O projeto não tem rotas de servidor, API routes, middleware nem uso de
// cookies()/headers(), então nada se perde na exportação.
const nextConfig: NextConfig = {
  output: "export",
  // O otimizador de imagem do Next exige um servidor Node; em export ele não roda.
  images: { unoptimized: true },
  // Gera /caminho/index.html em vez de /caminho.html, para o nginx resolver
  // o diretório direto, sem extensão na URL.
  trailingSlash: true,
};

export default nextConfig;
