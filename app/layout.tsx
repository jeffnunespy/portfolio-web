import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getPerfil } from "../lib/content";

export const metadata: Metadata = {
  title: {
    default: "Portfólio",
    template: "%s | Portfólio",
  },
  description: "Experiência pública inicial do portfólio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const perfil = getPerfil();

  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <Header />
        <main id="main-content" className="site-main">
          {children}
        </main>
        <Footer
          linkGithub={perfil.linkGithub}
          linkLinkedin={perfil.linkLinkedin}
          contatoEmail={perfil.contato.valor}
        />
      </body>
    </html>
  );
}
