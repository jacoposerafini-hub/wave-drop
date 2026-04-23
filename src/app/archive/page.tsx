import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 300;

export default async function ArchivePage() {
  const drops = await db.drop.findMany({
    where: { OR: [{ status: 'sold_out' }, { status: 'archived' }] },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20">
      <div className="stagger flex flex-col gap-4">
        <p className="eyebrow">Archive</p>
        <h1 className="display text-6xl md:text-9xl">DROP PASSATI</h1>
        <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Quello che è stato. I pezzi sotto non tornano più.
        </p>
      </div>

      {drops.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center gap-4 border border-dashed border-border py-20 text-center">
          <p className="display text-4xl text-muted">VUOTO</p>
          <p className="max-w-sm text-sm text-muted">
            Nessun drop archiviato ancora. Il primo deve ancora finire.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
          {drops.map((d, i) => (
            <Link
              key={d.id}
              href={`/drop/${d.slug}`}
              className="group relative block"
            >
              <div className="relative aspect-square overflow-hidden bg-bg-elevated ring-soft">
                {d.heroImage && (
                  <Image
                    src={d.heroImage}
                    alt={d.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[800ms] ease-smooth group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-opacity duration-300 group-hover:from-black/60" />

                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between">
                    <span className="pill bg-white text-black">
                      {d.status === 'sold_out' ? 'Sold out' : 'Archived'}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-ultra text-white/50">
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="display text-3xl md:text-4xl">{d.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                          {d.startsAt?.toLocaleDateString('it-IT', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={22}
                        className="shrink-0 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                      />
                    </div>
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
