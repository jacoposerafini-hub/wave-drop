import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
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

  const isUpcoming = drop.status === 'upcoming' && drop.startsAt && drop.startsAt > new Date();

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
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
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-bg-primary/20" />

        <div className="absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-5 md:px-10 pb-12 md:pb-20">
          <div className="stagger flex flex-col gap-6 md:gap-8">
            <span
              className={
                isUpcoming
                  ? 'pill self-start bg-white text-black'
                  : 'pill self-start bg-danger text-white animate-pulse'
              }
            >
              {isUpcoming ? 'Upcoming' : '● Live now'}
            </span>

            <h1 className="display text-[14vw] md:text-[10vw] leading-[0.85] max-w-6xl">
              {drop.name}
            </h1>

            {drop.tagline && (
              <p className="max-w-lg text-base md:text-lg text-white/80">{drop.tagline}</p>
            )}

            {isUpcoming && drop.startsAt ? (
              <div className="flex flex-col gap-4">
                <DropCountdown target={drop.startsAt} />
                <div className="max-w-sm">
                  <p className="pill text-muted mb-2">Notify me</p>
                  <NewsletterForm dropId={drop.id} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="#shop" className="btn-primary h-14 px-8 text-sm">
                  Shop the drop
                </Link>
                <Link href={`/drop/${drop.slug}`} className="btn-ghost h-14 px-8 text-sm">
                  Lookbook
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      {!isUpcoming && (
        <section id="shop" className="mx-auto max-w-[1600px] px-5 md:px-10 py-16 md:py-24">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="pill text-muted mb-2">The drop</p>
              <h2 className="display text-5xl md:text-7xl">{drop.products.length} pezzi</h2>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-muted text-right">
              Produzione limitata. Una volta finita, è finita.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
            {drop.products.map((p) => {
              const total = p.variants.reduce((s, v) => s + v.stock, 0);
              const avail = p.variants.reduce((s, v) => s + (v.stock - v.reserved), 0);
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
        <section className="mx-auto max-w-[1600px] px-5 md:px-10 py-16 md:py-24 border-t border-border">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="pill text-muted">About</p>
              <p className="display mt-3 text-4xl md:text-5xl">La storia del drop</p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-lg leading-relaxed text-white/80">{drop.description}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function NoDropState() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="pill text-muted mb-4">Stay tuned</p>
      <h1 className="display text-6xl md:text-9xl">IN ARRIVO</h1>
      <p className="mt-4 max-w-md text-muted">
        Il primo drop sta prendendo forma. Iscriviti per essere il primo a saperlo.
      </p>
      <div className="mt-8 w-full max-w-sm">
        <NewsletterForm />
      </div>
    </div>
  );
}
