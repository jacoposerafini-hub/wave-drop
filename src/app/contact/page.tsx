export const metadata = { title: 'Contatti' };

const CARDS: Array<{
  k: string;
  t: string;
  v: string;
  h: string;
  href: string;
}> = [
  {
    k: 'DM',
    t: 'Slide in our DMs',
    v: 'Per ordini, info, prenotazioni tavolo. Risposte veloci.',
    h: '@_wave.staff_',
    href: 'https://ig.me/m/_wave.staff_',
  },
  {
    k: 'Profilo',
    t: 'Tutti i drop, le serate, il backstage',
    v: 'Spoiler, foto, stories. Seguici per non perdere il prossimo drop.',
    h: '@_wave.staff_',
    href: 'https://instagram.com/_wave.staff_',
  },
];

const IG_LOGO =
  'https://imgs.search.brave.com/4QcGZpzmZob664SiqtBms2Azjb1cboTcbHZ4YWPRt0o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZXBuZ2xvZ29z/LmNvbS91cGxvYWRz/L2xvZ28taWctcG5n/L2xvZ28taWctaW5z/dGFncmFtLW5ldy1s/b2dvLXZlY3Rvci1k/b3dubG9hZC0xMy5w/bmc';

function CardIcon() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={IG_LOGO}
      alt="Instagram"
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
          Slide in.
        </h1>
        <p
          style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 500 }}
        >
          Vuoi collaborare, hai un&apos;idea, vuoi prenotare un tavolo o vuoi
          solo farci sapere che ci sei? Scrivici su Instagram.
        </p>
      </div>
      <div className="contact-grid">
        {CARDS.map((c) => (
          <a
            key={c.k}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >
            <div className="contact-card__icon">
              <CardIcon />
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
