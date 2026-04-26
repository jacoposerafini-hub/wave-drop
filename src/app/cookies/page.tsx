export const metadata = { title: 'Cookie' };

const TABLE: Array<{
  name: string;
  type: string;
  purpose: string;
  duration: string;
}> = [
  {
    name: 'wd_cart',
    type: 'Tecnico',
    purpose: 'Conserva i pezzi nel carrello tra le sessioni.',
    duration: '24 ore',
  },
  {
    name: 'wd_drop_*',
    type: 'Tecnico',
    purpose: 'Sblocca drop password-protetti dopo inserimento codice.',
    duration: 'Sessione',
  },
];

export default function CookiesPage() {
  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Cookie
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(72px, 13vw, 180px)' }}>
          Cookie <span className="italic">policy.</span>
        </h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 520 }}>
          Come usiamo i cookie e come puoi gestire il tuo consenso. Conforme
          al GDPR (Reg. UE 2016/679), Direttiva ePrivacy 2002/58/CE e alle
          linee guida del Garante Privacy (10 giugno 2021, rev. 2024).
          Ultimo aggiornamento: aprile 2026.
        </p>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', paddingBottom: 40 }}>
        <section style={{ borderTop: '1px solid var(--line)', padding: '28px 0' }}>
          <h3 style={{ marginBottom: 10, fontSize: 22 }}>Cosa sono i cookie</h3>
          <p style={{ color: 'var(--fg-dim)', lineHeight: 1.7 }}>
            I cookie sono piccoli file di testo salvati sul tuo dispositivo
            quando visiti un sito. Su Wave Drop usiamo solo cookie tecnici per
            far funzionare carrello, preferenze e accessi. Nessun cookie
            analitico, di profilazione o pubblicitario.
          </p>
        </section>

        <section style={{ borderTop: '1px solid var(--line)', padding: '28px 0' }}>
          <h3 style={{ marginBottom: 10, fontSize: 22 }}>Categorie</h3>
          <p style={{ color: 'var(--fg-dim)', lineHeight: 1.7 }}>
            <strong>Tecnici (necessari)</strong>: indispensabili al
            funzionamento del sito (carrello, preferenze, sicurezza). Non
            richiedono consenso.
            <br />
            <br />
            <strong>Analitici</strong>: non utilizzati su questo sito.
            <br />
            <br />
            <strong>Profilazione/pubblicità</strong>: non utilizzati su questo
            sito. Nessun tracciamento di terze parti.
          </p>
        </section>

        <section style={{ borderTop: '1px solid var(--line)', padding: '28px 0' }}>
          <h3 style={{ marginBottom: 10, fontSize: 22 }}>Cookie in uso</h3>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 13,
                color: 'var(--fg-dim)',
                marginTop: 14,
              }}
            >
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--fg)' }}>
                  <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Nome</th>
                  <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Tipo</th>
                  <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Finalità</th>
                  <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>Durata</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map((r) => (
                  <tr key={r.name}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--font-mono)' }}>{r.name}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>{r.type}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>{r.purpose}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>{r.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ borderTop: '1px solid var(--line)', padding: '28px 0' }}>
          <h3 style={{ marginBottom: 10, fontSize: 22 }}>Gestione del consenso</h3>
          <p style={{ color: 'var(--fg-dim)', lineHeight: 1.7 }}>
            Usiamo solo cookie tecnici, quindi non è richiesto consenso.
            Puoi comunque eliminare tutti i cookie del sito dalle impostazioni
            del tuo browser in qualsiasi momento.
          </p>
        </section>

        <section style={{ borderTop: '1px solid var(--line)', padding: '28px 0' }}>
          <h3 style={{ marginBottom: 10, fontSize: 22 }}>Titolare</h3>
          <p style={{ color: 'var(--fg-dim)', lineHeight: 1.7 }}>
            Wave Staff — Lucca, Italia. Contatto:{' '}
            <a
              href="mailto:ciao@wavestaff.it"
              style={{ color: 'var(--fg)', textDecoration: 'underline' }}
            >
              ciao@wavestaff.it
            </a>
            . Vedi anche la{' '}
            <a
              href="/privacy"
              style={{ color: 'var(--fg)', textDecoration: 'underline' }}
            >
              privacy policy
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
