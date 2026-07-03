import { redirect } from "next/navigation";

// A landing principal ainda não existe — por enquanto, a home leva
// direto para a página de precificação.
export default function Home() {
  redirect("/precificacao");
}
