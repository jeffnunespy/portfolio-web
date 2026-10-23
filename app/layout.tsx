import type { Metadata } from "next";
import { Geologica, Martian_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getPerfil } from "../lib/content";
import { SITE_LOCALE, SITE_NAME, SITE_URL } from "../lib/site";

// Geologica variável cobre todos os pesos do texto em um único arquivo; a
// Martian Mono só aparece em legendas e notação técnica, por isso um peso.
const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
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
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geologica.variable} ${martianMono.variable}`}
    >
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
