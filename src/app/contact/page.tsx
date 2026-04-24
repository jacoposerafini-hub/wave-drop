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

const IG_LOGO =
  'https://imgs.search.brave.com/4QcGZpzmZob664SiqtBms2Azjb1cboTcbHZ4YWPRt0o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZXBuZ2xvZ29z/LmNvbS91cGxvYWRz/L2xvZ28taWctcG5n/L2xvZ28taWctaW5z/dGFncmFtLW5ldy1s/b2dvLXZlY3Rvci1k/b3dubG9hZC0xMy5w/bmc';
const MAIL_LOGO =
  'https://imgs.search.brave.com/PGQOm5JpUSR-7pRHyB6kG_vDEOU6Fp7s2hCI6jRH4Og/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvRW1h/aWwtTG9nby1CYWNr/Z3JvdW5kLVBORy5w/bmc';

function CardIcon({ icon }: { icon: 'insta' | 'mail' }) {
  const src = icon === 'insta' ? IG_LOGO : MAIL_LOGO;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={icon}
      width={36}
      height={36}
      style={{ objectFit: 'contain' }}
    />
  );
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
