export const metadata = { title: 'Termini' };

const SECTIONS: Array<{ h: string; b: string }> = [
  {
    h: 'Oggetto',
    b: 'Questi termini regolano l\u2019acquisto di prodotti Wave Drop tramite wavestaff.it. Acquistando accetti le condizioni qui descritte.',
  },
  {
    h: 'Prodotti e disponibilità',
    b: 'Tutti i drop sono in tiratura limitata. Una volta esauriti, non vengono ristampati. La disponibilità è aggiornata in tempo reale ma non garantita fino al completamento dell\u2019ordine.',
  },
  {
    h: 'Prezzi e pagamento',
    b: 'Tutti i prezzi sono in euro e includono IVA. Pagamento gestito da Stripe: carte di credito, Apple Pay, Google Pay. Nessun dato di pagamento viene salvato sui nostri server.',
  },
  {
    h: 'Spedizione',
    b: 'Dettagli in /shipping. Tempi indicativi: 48h in Italia, 3-5 giorni lavorativi in Europa. Non siamo responsabili per ritardi del corriere.',
  },
  {
    h: 'Diritto di recesso',
    b: 'Hai 14 giorni dalla consegna per esercitare il recesso. Dettagli in /returns. Il bene deve essere restituito integro con etichette originali.',
  },
  {
    h: 'Limitazioni di responsabilità',
    b: 'Wave Staff non risponde di danni indiretti derivanti dall\u2019uso dei prodotti. Per difetti di conformità si applica la garanzia legale di 2 anni.',
  },
  {
    h: 'Legge applicabile',
    b: 'Foro competente: Lucca, Italia. Legge applicabile: italiana.',
  },
];

export default function TermsPage() {
  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Termini
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(72px, 13vw, 180px)' }}>
          Terms <span className="italic">of sale.</span>
        </h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 520 }}>
          Cose noiose che però devi sapere. Lette, messe nero su bianco,
          aggiornate al 2026.
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
