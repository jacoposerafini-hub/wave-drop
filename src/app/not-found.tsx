import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink/5 blur-[120px]" />
      <div className="relative flex flex-col items-center">
        <p className="pill bg-danger/10 text-danger">
          <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-danger" />
          404
        </p>
        <h1 className="display mt-4 text-[22vw] leading-[0.85] md:text-[12vw]">
          LOST.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          Questa pagina non esiste. O forse è già sold out.
        </p>
        <Link href="/" className="btn-primary group mt-10 h-12 px-6">
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Torna al drop
        </Link>
      </div>
    </div>
  );
}
