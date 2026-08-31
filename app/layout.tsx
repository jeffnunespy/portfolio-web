import type { Metadata } from "next";
import { Zilla_Slab, Archivo, Archivo_Narrow } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getPerfil } from "../lib/content";
import { SITE_LOCALE, SITE_NAME, SITE_URL } from "../lib/site";

const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-field",
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
      className={`${zillaSlab.variable} ${archivo.variable} ${archivoNarrow.variable}`}
    >
      <body>
        {/*
          THESIS: o portfólio é um fichário catalográfico, não uma vitrine — cada projeto
          é uma ficha indexada que declara o que foi verificado e o que ainda não foi.
          Recusa a grade de cartões roxos com sombra suave que a categoria sempre entrega.
          OWN-WORLD: tinta #1a1a17 sobre cartão #f4f1e8, carimbo cinábrio #8a2c1e, régua
          de campo em Archivo Narrow versalete, corpo em Archivo, campos e índices em
          Zilla Slab. Filetes de 1px e 2px, zero raio, zero sombra: o relevo vem do papel.
          STORY: o visitante entende que este é um registro honesto em construção, acredita
          porque o não-verificado está carimbado e não escondido, e vai ao GitHub ou ao contato.
          FIRST VIEWPORT: ficha de cabeçalho ocupando a tela inteira — número de índice e
          data no topo, nome em corpo monumental no campo principal, carimbo de estado em
          ângulo sobre o campo inferior, e a tabela de campos catalográficos abaixo.
          FORM: Ficha de Catálogo, candidata 3 da lista fundamentada; seed 05c7c68e.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
          review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
        */}
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
