export const metadata = { title: 'Privacy' };

const SECTIONS: Array<{ h: string; b: string }> = [
  {
    h: 'Titolare del trattamento',
    b: 'Wave Staff — Lucca, Italia. P.IVA 00000000000. Contatto: ciao@wavestaff.it.',
  },
  {
    h: 'Dati raccolti',
    b: 'Email, nome, indirizzo di spedizione, dati di pagamento (gestiti da Stripe), dati di navigazione (cookie tecnici e analitici anonimi).',
  },
  {
    h: 'Finalità',
    b: 'Gestione ordini, spedizione, assistenza clienti, newsletter (solo con consenso), analisi aggregata del sito per migliorare la UX.',
  },
  {
    h: 'Conservazione',
    b: 'Dati ordini conservati per 10 anni (obblighi fiscali). Dati newsletter finché resti iscritto. Dati di navigazione anonimi per 14 mesi.',
  },
  {
    h: 'Terze parti',
    b: 'Stripe (pagamenti), Resend (newsletter), Vercel (hosting), Neon (database). Nessun dato viene venduto.',
  },
  {
    h: 'I tuoi diritti',
    b: 'Puoi chiedere accesso, rettifica, cancellazione o portabilità dei tuoi dati scrivendo a ciao@wavestaff.it. Ti rispondiamo entro 30 giorni.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Privacy
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(72px, 13vw, 180px)' }}>
          Privacy <span className="italic">policy.</span>
        </h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 520 }}>
          Trattiamo i tuoi dati con cura. Nessuno spam, nessuna vendita a
          terzi. Aggiornato al 2026.
        </p>
      </div>
      <div style={{ maxWidth: 780, margin: '0 auto', paddingBottom: 40 }}>
        {SECTIONS.map((s) => (
          <section
            key={s.h}
            style={{
              borderTop: '1px solid var(--line)',
              padding: '28px 0',
            }}
          >
            <h3 style={{ marginBottom: 10, fontSize: 22 }}>{s.h}</h3>
            <p style={{ color: 'var(--fg-dim)', lineHeight: 1.7 }}>{s.b}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
