import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="page-enter container">
      <div className="notfound">
        <div className="notfound__code">404 / lost</div>
        <h1 className="notfound__title">
          Sold <span className="italic">out.</span>
        </h1>
        <p
          style={{
            color: 'var(--fg-dim)',
            maxWidth: 420,
            margin: '0 auto 28px',
          }}
        >
          Questa pagina non è disponibile. Torna al drop corrente.
        </p>
        <Link href="/" className="btn primary">
          Torna al drop <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
