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
      <section className="hero container">
        <div className="hero__grid">
          <div>
            <div className="eyebrow">
              <span className="dot" />
              {drop.name} · Notte
            </div>
            <h1 className="hero__title" style={{ marginTop: 20 }}>
              <span>Vivi</span>{' '}
              <span className="italic">la notte</span>
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
                'Drop 007 disponibile dal 17 maggio, alle 22:22. Sei pezzi, produzione limitata, realizzati in Italia. Una volta esauriti, non torneranno più in stock.'}
            </p>
            <div className="row" style={{ marginTop: 24 }}>
              <Link href="#shop" className="btn primary">
                Entra nel drop <ArrowRight size={16} />
              </Link>
              <Link href={`/drop/${drop.slug}`} className="btn ghost">
                Vedi i pezzi
              </Link>
            </div>
          </div>
          <aside className="hero__aside">
            <div className="countdown-hero">
              <div className="countdown-hero__bg" />
              {isUpcoming && drop.startsAt ? (
                <DropCountdown target={drop.startsAt} />
              ) : (
                <DropCountdown
                  target={drop.endsAt || new Date(Date.now() + 7 * 86400000)}
                />
              )}
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Avviso 48h prima
              </div>
              <NewsletterForm dropId={drop.id} />
            </div>
          </aside>
        </div>
      </section>

      <section className="hero-stack">
        <div className="hero-stack__left">
          <div className="media tall play" data-label="Video loop · Drop 007 campaign" />
          <div className="media square" data-label="Foto · Behind the scenes" />
          <div className="media square" data-label="Flyer · 17.05 — 22:22" />
        </div>
        <div className="hero-stack__right">
          <div className="media wide" data-label="Lookbook · Notturno Hoodie" />
          <div className="media wide" data-label="Lookbook · Cap 22:22" />
        </div>
      </section>

      <div className="container" id="shop">
        <div className="section-head">
          <div className="section-head__l">
            Il <span className="italic">Drop</span>
          </div>
          <div className="section-head__r">
            Ogni pezzo disponibile fino a esaurimento. Nessun riassortimento,
            nessuna ristampa.
          </div>
        </div>
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          007 · {drop.products.length} pezzi · realizzati in Italia
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
              Vedi tutti i pezzi <ArrowRight size={16} />
            </Link>
          </div>
        )}

        <section className="editorial">
          <div className="editorial__text">
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Dietro il drop
            </div>
            <h3>Una città, sei pezzi.</h3>
            <p>
              Ogni capo è ispirato a un momento della notte di Lucca — dal
              tramonto alle ore piccole. Prodotti tra Prato e Lucca, tirature
              ridotte, nessun restock.
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
    <main className="page-enter container">
      <section className="hero">
        <div
          className="hero__grid"
          style={{ gridTemplateColumns: '0.85fr 1.15fr' }}
        >
          <div>
            <div className="eyebrow">
              <span className="dot" />
              Stay tuned · Drop 001
            </div>
            <h1
              className="hero__title"
              style={{
                marginTop: 20,
                whiteSpace: 'nowrap',
                fontSize: 'clamp(44px, 7vw, 104px)',
              }}
            >
              <span>Ready to</span>{' '}
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
          <aside className="hero__aside" style={{ paddingLeft: 120 }}>
            <div className="countdown-hero" style={{ minHeight: 520 }}>
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
