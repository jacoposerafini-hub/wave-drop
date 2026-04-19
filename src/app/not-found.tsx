import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="pill text-muted mb-4">404</p>
      <h1 className="display text-[18vw] md:text-[10vw] leading-[0.9]">LOST.</h1>
      <p className="mt-4 max-w-md text-muted">
        Questa pagina non esiste. O forse è già sold out.
      </p>
      <Link href="/" className="btn-primary mt-8 h-12 px-6">Torna al drop</Link>
    </div>
  );
}
