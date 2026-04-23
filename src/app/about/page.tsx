import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'About' };

const PILLARS = [
  {
    num: '01',
    title: 'Filtro',
    body: 'Portiamo gente nei posti giusti. Costruiamo serate con i locali che meritano.',
  },
  {
    num: '02',
    title: 'Label',
    body: 'Wave Drop è la nostra uniforme. Drop limitati. Produzione vera. Niente restock.',
  },
  {
    num: '03',
    title: 'Loop',
    body: 'Quello che esce lo indossi o lo perdi. Niente magazzini pieni di invenduto.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
      <div className="stagger flex flex-col gap-4">
        <p className="eyebrow">About</p>
        <h1 className="display text-[14vw] leading-[0.9] md:text-[8vw]">
          SIAMO<br />
          <span className="text-gradient-accent">WAVE.</span>
        </h1>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-12 md:mt-24">
        <div className="md:col-span-7">
          <p className="text-xl leading-relaxed text-white/85 md:text-2xl">
            Non ti facciamo entrare. Ti facciamo vivere la notte.
          </p>
          <div className="mt-6 h-px w-16 bg-accent" />
          <p className="mt-8 text-base leading-relaxed text-muted">
            Wave Staff nasce a Lucca come collettivo di persone che non
            sopportavano più di uscire alla cieca. Oggi siamo il filtro tra te e
            la nightlife della città. Portiamo gente nei posti giusti,
            costruiamo serate con i locali che meritano, e ora anche vestiamo
            chi fa parte del mondo.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Wave Drop è la nostra label. Drop limitati. Produzione vera. Niente
            restock. Niente magazzini pieni di invenduto. Quello che fai uscire
            lo indossi o lo perdi.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <div className="border border-border bg-bg-elevated p-8">
            <p className="eyebrow">Base</p>
            <p className="display mt-4 text-5xl">LUCCA</p>
            <p className="mt-2 text-sm text-muted">Toscana, Italia</p>
            <div className="my-6 divider-x" />
            <p className="eyebrow">Nato</p>
            <p className="display mt-4 text-5xl">2023</p>
            <p className="mt-2 text-sm text-muted">Dietro un bancone</p>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div
            key={p.num}
            className="card-hover group p-8"
          >
            <p className="font-mono text-xs text-accent">{p.num}</p>
            <p className="display mt-4 text-3xl">{p.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-24 border border-border bg-bg-elevated p-10 md:p-16">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow mb-3">Prossimo drop</p>
            <p className="display text-4xl md:text-6xl">ENTRA NEL LOOP.</p>
          </div>
          <div className="flex gap-3 md:col-span-4 md:justify-end">
            <Link href="/" className="btn-primary group h-12 px-6">
              Shop
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link href="/contact" className="btn-ghost h-12 px-6">
              Contatti
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
