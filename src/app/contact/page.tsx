import { Instagram, Mail } from 'lucide-react';

export const metadata = { title: 'Contatti' };

const CARDS: Array<{
  k: string;
  t: string;
  v: string;
  h: string;
  href?: string;
  icon: 'insta' | 'mail';
}> = [
  {
    k: 'Instagram',
    t: 'Slide in our DMs',
    v: 'Spoiler, backstage e vita notturna. DM sempre aperti.',
    h: '@wavestaff',
    href: 'https://instagram.com/wavestaff',
    icon: 'insta',
  },
  {
    k: 'Email',
    t: 'Per la roba seria',
    v: 'Scrivici qui per collaborazioni, stampa o info ordini.',
    h: 'ciao@wavestaff.it',
    href: 'mailto:ciao@wavestaff.it',
    icon: 'mail',
  },
];

function CardIcon({ icon }: { icon: 'insta' | 'mail' }) {
  if (icon === 'insta') return <Instagram size={24} />;
  return <Mail size={24} />;
}

export default function ContactPage() {
  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Contatti
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(84px, 15vw, 220px)' }}>
          Drop a line.
        </h1>
        <p
          style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 500 }}
        >
          Vuoi collaborare, hai un&apos;idea o vuoi solo farci sapere che ci
          sei? Fatti sentire.
        </p>
      </div>
      <div className="contact-grid">
        {CARDS.map((c) => (
          <a
            key={c.k}
            href={c.href}
            target={c.href?.startsWith('http') ? '_blank' : undefined}
            rel={c.href?.startsWith('http') ? 'noreferrer' : undefined}
            className="contact-card"
          >
            <div className="contact-card__icon">
              <CardIcon icon={c.icon} />
            </div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              {c.k}
            </div>
            <h4>{c.t}</h4>
            <p>{c.v}</p>
            <div className="contact-card__handle">{c.h}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
