import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import DropCountdown from '@/components/DropCountdown';
import PasswordGate from '@/components/PasswordGate';
import NewsletterForm from '@/components/NewsletterForm';

export const revalidate = 60;

const HERO_META = ['6 pezzi', 'Lucca, IT', '22:22 CET'];

export default async function HomePage() {
  const drop = await db.drop.findFirst({
    where: { OR: [{ status: 'live' }, { status: 'upcoming' }] },
    orderBy: [{ featured: 'desc' }, { startsAt: 'asc' }],
    include: {
      products: {
        orderBy: { position: 'asc' },
        include: { variants: true },
      },
    },
  });

  if (!drop) return <NoDropState />;

  if (drop.accessType === 'password') {
    const unlocked = cookies().get(`wd_drop_${drop.slug}`)?.value === '1';
    if (!unlocked) return <PasswordGate dropSlug={drop.slug} />;
  }

  const isUpcoming =
    drop.status === 'upcoming' && drop.startsAt && drop.startsAt > new Date();

  return (
    <main className="page-enter">
      {/* HERO */}
      <section className="hero hero--nodrop">
        <div className="hero__grid hero__grid--nodrop">
          <div>
            <div className="eyebrow">
              {drop.name} · Notte
            </div>
            <h1
              className="hero__title"
              style={{
                marginTop: 20,
                fontSize: 'clamp(56px, 7vw, 104px)',
                lineHeight: 1,
              }}
            >
              <span>Vivi</span>
              <span style={{ display: 'inline-block', width: '0.4em' }} />
              <span className="italic">la notte.</span>
            </h1>
            <div className="hero__meta">
              {HERO_META.map((m) => (
                <span key={m} className="chip">
                  {m}
                </span>
              ))}
            </div>
            <p className="hero__copy">
              {drop.tagline ||
                'Drop 001 disponibile dal 17 maggio, alle 22:22. Sei pezzi, produzione limitata, realizzati in Italia. Una volta esauriti, non torneranno più in stock.'}
            </p>
            <div className="row" style={{ marginTop: 24 }}>
              <Link href="#shop" className="btn primary">
                Entra nel drop <ArrowRight size={16} />
              </Link>
              <Link href={`/drop/${drop.slug}`} className="btn ghost">
                Vedi i pezzi
              </Link>
            </div>
            <div style={{ marginTop: 28 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Avviso 48h prima
              </div>
              <NewsletterForm dropId={drop.id} />
            </div>
          </div>
          <aside className="hero__aside hero__aside--nodrop">
            <div className="countdown-hero countdown-hero--nodrop">
              <div className="countdown-hero__bg" />
              {isUpcoming && drop.startsAt ? (
                <DropCountdown target={drop.startsAt} />
              ) : (
                <DropCountdown
                  target={drop.endsAt || new Date(Date.now() + 7 * 86400000)}
                />
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="container" id="shop">
        <div className="section-head">
          <div className="section-head__l">
            Solo <span className="italic">stanotte.</span>
          </div>
          <div className="section-head__r">
            Tirature ridotte, edizione numerata. Quando finiscono, finiscono
            davvero — niente restock, niente ristampe, nessuna seconda chance.
          </div>
        </div>
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          {drop.name} · {drop.products.length} pezzi · made in Italy · 22:22
          CET
        </div>
        <div className="product-grid">
          {drop.products.slice(0, 4).map((p, i) => {
            const total = p.variants.reduce((s, v) => s + v.stock, 0);
            const avail = p.variants.reduce(
              (s, v) => s + (v.stock - v.reserved),
              0,
            );
            return (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                priceCents={p.priceCents}
                images={p.images}
                stockTotal={total}
                stockAvailable={avail}
                index={`${String(i + 1).padStart(2, '0')}/${String(drop.products.length).padStart(2, '0')}`}
              />
            );
          })}
        </div>
        {drop.products.length > 4 && (
          <div className="row" style={{ justifyContent: 'center', marginTop: 28 }}>
            <Link href={`/drop/${drop.slug}`} className="btn ghost">
              Tutto il drop <ArrowRight size={16} />
            </Link>
          </div>
        )}

        <section className="editorial">
          <div className="editorial__text">
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Dietro il drop
            </div>
            <h3>
              Nato <span className="italic">di notte.</span>
            </h3>
            <p>
              Ogni pezzo prende forma da un momento di una serata a Lucca —
              dal primo bicchiere alle ore piccole. Tessuti pesanti, stampe
              fatte a mano, taglio oversize. Pensato per chi resta fino alla
              fine.
            </p>
            <p style={{ marginTop: 14 }}>
              Tagliato e cucito tra Prato e Lucca. Numerato pezzo per pezzo.
              Quando il drop chiude, sparisce nell&apos;archivio e non torna
              più.
            </p>
            <div className="row" style={{ marginTop: 20 }}>
              <Link href="/about" className="btn ghost sm">
                Chi siamo <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div
            className="editorial__img-a media portrait"
            data-label="Lookbook · Staff Tee"
          />
          <div className="editorial__img-b media tall" data-label="Mood · 22:22" />
        </section>
      </div>
    </main>
  );
}

function NoDropState() {
  const target = new Date('2026-05-17T22:22:00');
  return (
    <main className="page-enter">
      <section className="hero hero--nodrop">
        <div className="hero__grid hero__grid--nodrop">
          <div>
            <div className="eyebrow">
              <span className="dot" />
              Stay tuned · Drop 001
            </div>
            <h1
              className="hero__title"
              style={{
                marginTop: 20,
                fontSize: 'clamp(56px, 7vw, 104px)',
                lineHeight: 1,
              }}
            >
              <span>Ready to</span>
              <span style={{ display: 'inline-block', width: '0.4em' }} />
              <span className="italic">drop.</span>
            </h1>
            <p className="hero__copy">
              La notte sta per prendersi il suo spazio. Il Drop 001 è quasi
              fuori. Iscriviti e assicurati il tuo pezzo prima del sold out.
            </p>
            <div style={{ marginTop: 28 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Avvisami prima
              </div>
              <NewsletterForm />
            </div>
          </div>
          <aside className="hero__aside hero__aside--nodrop">
            <div className="countdown-hero countdown-hero--nodrop">
              <div
                className="countdown-hero__bg"
                data-label="Teaser · Drop 001"
              />
              <DropCountdown target={target} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
