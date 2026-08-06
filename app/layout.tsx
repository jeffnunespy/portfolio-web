import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfólio',
  description: 'Experiência pública inicial do portfólio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
