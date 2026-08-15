import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Página não encontrada</h1>
      <p>A página que você procura não existe ou foi removida.</p>
      <Link href="/">Voltar para a página inicial</Link>
    </div>
  );
}
