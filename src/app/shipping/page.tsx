export const metadata = { title: 'Spedizioni' };

const BLOCKS: Array<{ k: string; t: string; v: string }> = [
  {
    k: '48h',
    t: 'Consegna lampo',
    v: 'Ordini confermati entro le 14:00 partono in giornata. Consegna in 48h lavorative in tutta Italia.',
  },
  {
    k: '€0',
    t: 'Gratis sopra 50€',
    v: 'Spedizione standard gratuita per ordini sopra i 50€. Sotto, 8€ flat in tutta Italia.',
  },
  {
    k: 'EU',
    t: 'Europa',
    v: 'Spediamo in tutta Europa. Tempi 3-5 giorni lavorativi. Costi calcolati al checkout.',
  },
  {
    k: '24h',
    t: 'Tracking istantaneo',
    v: 'Ricevi il codice di tracciamento via email appena l\u2019ordine esce dal magazzino.',
  },
];

export default function ShippingPage() {
  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Spedizioni
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(72px, 13vw, 180px)' }}>
          Fast <span className="italic">ship.</span>
        </h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 520 }}>
          Tempi stretti, pezzi a casa tua prima del weekend. Zero attese, zero
          scuse.
        </p>
      </div>
      <div className="contact-grid">
        {BLOCKS.map((b) => (
          <div key={b.k} className="contact-card">
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              {b.k}
            </div>
            <h4>{b.t}</h4>
            <p>{b.v}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
