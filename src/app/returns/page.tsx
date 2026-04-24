export const metadata = { title: 'Resi' };

const BLOCKS: Array<{ k: string; t: string; v: string }> = [
  {
    k: '14gg',
    t: 'Finestra resi',
    v: 'Hai 14 giorni dalla consegna per chiedere il reso. Il pezzo deve essere integro, etichette attaccate.',
  },
  {
    k: 'Free',
    t: 'Primo reso gratis',
    v: 'Il primo reso per ordine è a carico nostro. Successivi, spese a carico cliente.',
  },
  {
    k: '3-5gg',
    t: 'Rimborso veloce',
    v: 'Una volta ricevuto e verificato il pezzo, rimborso in 3-5 giorni lavorativi sul metodo di pagamento usato.',
  },
  {
    k: 'NO',
    t: 'Cambio taglia',
    v: 'Non facciamo cambi: apri un reso e riordina la taglia giusta. Sicuro, veloce, trasparente.',
  },
];

export default function ReturnsPage() {
  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Resi
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(72px, 13vw, 180px)' }}>
          Easy <span className="italic">returns.</span>
        </h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 520 }}>
          Non ti convince? Rimandalo indietro. Niente burocrazia, niente
          domande stupide.
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
      <p
        style={{
          marginTop: 40,
          color: 'var(--fg-mute)',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Per aprire un reso scrivi a{' '}
        <a
          href="mailto:ciao@wavestaff.it"
          style={{ color: 'var(--fg)', textDecoration: 'underline' }}
        >
          ciao@wavestaff.it
        </a>
      </p>
    </main>
  );
}
