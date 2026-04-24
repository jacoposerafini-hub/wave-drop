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
    h: 'Base giuridica',
    b: 'Esecuzione del contratto (art. 6.1.b GDPR) per gli ordini; consenso (art. 6.1.a) per newsletter e cookie analitici; obbligo di legge (art. 6.1.c) per fatturazione; legittimo interesse (art. 6.1.f) per prevenzione frodi e sicurezza del sito.',
  },
  {
    h: 'Conservazione',
    b: 'Dati ordini conservati per 10 anni (obblighi fiscali). Dati newsletter finché resti iscritto. Dati di navigazione anonimi per 14 mesi.',
  },
  {
    h: 'Terze parti e destinatari',
    b: 'Stripe Inc. (pagamenti), Resend (newsletter), Vercel (hosting), Neon (database PostgreSQL). Tutti firmano DPA conformi al GDPR. Nessun dato viene venduto a terzi.',
  },
  {
    h: 'Trasferimenti extra-UE',
    b: 'Alcuni provider (Stripe, Vercel) hanno sede USA. Trasferimenti effettuati sulla base delle Standard Contractual Clauses (SCC) approvate dalla Commissione UE e del EU-US Data Privacy Framework (adeguatezza 2023).',
  },
  {
    h: 'I tuoi diritti',
    b: 'Artt. 15-22 GDPR: accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, revoca del consenso. Scrivi a ciao@wavestaff.it. Ti rispondiamo entro 30 giorni.',
  },
  {
    h: 'Reclamo al Garante',
    b: 'Se ritieni che il trattamento violi la normativa, puoi proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
  },
  {
    h: 'Minori',
    b: 'Il sito non si rivolge a minori di 14 anni. Non raccogliamo consapevolmente dati di minori senza consenso dei genitori.',
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
          terzi. Base normativa: GDPR (Reg. UE 2016/679) e D.Lgs. 196/2003
          aggiornato al D.Lgs. 101/2018. Ultimo aggiornamento: aprile 2026.
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
