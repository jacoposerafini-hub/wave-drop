import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import DropCountdown from '@/components/DropCountdown';
import PasswordGate from '@/components/PasswordGate';
import NewsletterForm from '@/components/NewsletterForm';

export const revalidate = 60;

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
    <div className="relative">
      {/* HERO */}
      <section className="relative -mt-16 h-[100svh] min-h-[640px] w-full overflow-hidden">
        {drop.heroVideo ? (
          <video
            src={drop.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : drop.heroImage ? (
          <Image
            src={drop.heroImage}
            alt={drop.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-grad-cosmic" />
        )}

        {/* Overlay stack */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-bg-primary/10" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />

        <div className="absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-5 pb-14 pt-24 md:px-10 md:pb-20">
          <div className="stagger flex flex-col gap-6 md:gap-8">
            <span
              className={
                isUpcoming
                  ? 'pill self-start bg-white text-black'
                  : 'pill relative self-start bg-danger text-white animate-pulse-ring'
              }
            >
              {isUpcoming ? (
                <>
                  <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-black" />
                  Upcoming
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Live now
                </>
              )}
            </span>

            <h1 className="display max-w-6xl text-[15vw] leading-[0.82] md:text-[10vw]">
              {drop.name}
            </h1>

            {drop.tagline && (
              <p className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                {drop.tagline}
              </p>
            )}

            {isUpcoming && drop.startsAt ? (
              <div className="flex flex-col gap-6">
                <DropCountdown target={drop.startsAt} />
                <div className="max-w-sm">
                  <p className="eyebrow mb-3">Notify me</p>
                  <NewsletterForm dropId={drop.id} />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#shop"
                  className="btn-primary group h-14 px-8 text-sm"
                >
                  Shop the drop
                  <ArrowRight
                    size={16}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href={`/drop/${drop.slug}`}
                  className="btn-ghost h-14 px-8 text-sm"
                >
                  Lookbook
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        {!isUpcoming && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted animate-float">
            <span className="text-[10px] uppercase tracking-ultra">Scroll</span>
            <ArrowDown size={14} strokeWidth={1.5} />
          </div>
        )}
      </section>

      {/* MARQUEE STRIP */}
      {!isUpcoming && (
        <div className="relative overflow-hidden border-y border-border bg-bg-sunken py-4">
          <div className="flex w-max animate-marquee-fast gap-10 whitespace-nowrap text-xs font-semibold uppercase tracking-ultra text-muted">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex gap-10">
                {['Produzione limitata', 'Spedizione 3-5 gg', 'Reso gratuito 14gg', 'Made in Italy', 'Drop #1'].map(
                  (t, i) => (
                    <span key={`${dup}-${i}`} className="flex items-center gap-10">
                      {t}
                      <span className="text-accent">◆</span>
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {!isUpcoming && (
        <section
          id="shop"
          className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24"
        >
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">The drop</p>
              <h2 className="display text-5xl md:text-7xl">
                {drop.products.length} pezzi
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-relaxed text-muted md:block">
              Produzione limitata.<br />
              Una volta finita, è finita.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
            {drop.products.map((p) => {
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
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ABOUT THE DROP */}
      {drop.description && (
        <section className="border-t border-border">
          <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 md:grid-cols-12 md:gap-16 md:px-10 md:py-28">
            <div className="md:col-span-4">
              <p className="eyebrow mb-4">About</p>
              <p className="display text-4xl leading-[0.95] md:text-5xl">
                La storia<br />del drop
              </p>
              <div className="mt-6 h-px w-16 bg-accent" />
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-lg leading-relaxed text-white/85 md:text-xl">
                {drop.description}
              </p>
              <Link
                href={`/drop/${drop.slug}`}
                className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent link-underline"
              >
                Vedi lookbook <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function NoDropState() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
      <div className="relative flex flex-col items-center">
        <p className="pill bg-white/5 text-muted backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-accent" />
          Stay tuned
        </p>
        <h1 className="display mt-4 text-6xl md:text-9xl">IN ARRIVO</h1>
        <p className="mt-4 max-w-md text-muted">
          Il primo drop sta prendendo forma.<br />
          Iscriviti per essere il primo a saperlo.
        </p>
        <div className="mt-10 w-full max-w-sm">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
