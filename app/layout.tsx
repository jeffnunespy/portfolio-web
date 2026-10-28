import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getPerfil } from "../lib/content";
import { SITE_LOCALE, SITE_NAME, SITE_URL } from "../lib/site";

// Uma fonte variável, servida pelo próprio site, cobre toda a direção visual.
const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const perfil = getPerfil();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: perfil.tituloPosicionamento,
      template: `%s | ${SITE_NAME}`,
    },
    description: perfil.descricaoPosicionamento,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      url: "/",
      title: perfil.tituloPosicionamento,
      description: perfil.descricaoPosicionamento,
    },
    twitter: {
      card: "summary_large_image",
      title: perfil.tituloPosicionamento,
      description: perfil.descricaoPosicionamento,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const perfil = getPerfil();

  return (
    <html lang="pt-BR" className={geologica.variable}>
      <body>
        {/* O sistema visual — tese, paleta, tipografia e bans — está em DESIGN.md. */}
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <Header nome={perfil.nome} />
        <main id="main-content" className="site-main" tabIndex={-1}>
          {children}
        </main>
        <Footer
          nome={perfil.nome}
          linkGithub={perfil.linkGithub}
          linkLinkedin={perfil.linkLinkedin}
          contatoEmail={perfil.contato.valor}
        />
      </body>
    </html>
  );
}
