import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 300;

const MONTHS_IT = [
  'Gen',
  'Feb',
  'Mar',
  'Apr',
  'Mag',
  'Giu',
  'Lug',
  'Ago',
  'Set',
  'Ott',
  'Nov',
  'Dic',
];

function formatMonthIt(d: Date) {
  return `${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function ArchivePage() {
  const drops = await db.drop.findMany({
    where: { OR: [{ status: 'sold_out' }, { status: 'archived' }] },
    orderBy: { createdAt: 'desc' },
    include: {
      products: { select: { id: true } },
    },
  });

  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Archivio
        </div>
        <h1 className="display">Drop Passati</h1>
        <p
          style={{
            color: 'var(--fg-dim)',
            marginTop: 20,
            maxWidth: 520,
          }}
        >
          Quello che è stato. I pezzi sotto non tornano più.
        </p>
      </div>
      {drops.length === 0 ? (
        <div
          style={{
            padding: '80px 20px',
            textAlign: 'center',
            border: '1px dashed var(--line-2)',
            borderRadius: 'var(--r-lg)',
            marginTop: 40,
          }}
        >
          <div className="display" style={{ fontSize: 56, color: 'var(--fg-mute)' }}>
            VUOTO
          </div>
          <p style={{ color: 'var(--fg-dim)', marginTop: 12, fontSize: 14 }}>
            Nessun drop archiviato ancora. Il primo deve ancora finire.
          </p>
        </div>
      ) : (
        <div className="archive">
          {drops.map((d, i) => {
            const n = String(drops.length - i).padStart(3, '0');
            const date = d.startsAt ? formatMonthIt(d.startsAt) : '—';
            const pieces = `${d.products.length} pezzi`;
            const state =
              d.status === 'archived' ? 'Archived' : 'Sold out';
            return (
              <Link
                key={d.id}
                href={`/drop/${d.slug}`}
                className="archive__row"
              >
                <span className="archive__num">Drop {n}</span>
                <span className="archive__name">{d.name}</span>
                <span className="archive__date">{date}</span>
                <span className="archive__pieces">{pieces}</span>
                <span className="archive__state">{state}</span>
                <span className="archive__arrow">
                  <ArrowRight size={18} />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
