import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';

export const revalidate = 300;

export default async function ArchivePage() {
  const drops = await db.drop.findMany({
    where: { OR: [{ status: 'sold_out' }, { status: 'archived' }] },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-16">
      <p className="pill text-muted mb-4">Archive</p>
      <h1 className="display text-6xl md:text-9xl">DROP PASSATI</h1>
      <p className="mt-4 max-w-md text-muted">
        Quello che è stato. I pezzi sotto non tornano più.
      </p>

      {drops.length === 0 ? (
        <p className="mt-20 text-center text-muted">Nessun drop archiviato ancora.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {drops.map((d) => (
            <Link key={d.id} href={`/drop/${d.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden bg-bg-elevated">
                {d.heroImage && (
                  <Image
                    src={d.heroImage}
                    alt={d.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <span className="pill self-start bg-white text-black">Sold out</span>
                  <div>
                    <p className="display text-3xl">{d.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {d.startsAt?.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
