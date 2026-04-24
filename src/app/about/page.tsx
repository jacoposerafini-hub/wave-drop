export const metadata = { title: 'About' };

const STATS = [
  { v: '006', k: 'Drop usciti' },
  { v: '042', k: 'Serate nel 2025' },
  { v: '12K', k: 'Nella crew' },
  { v: '01', k: 'Città, per ora' },
];

const BODY = [
  'Nati a Lucca, cresciuti nei club. Wave non è solo uno staff, è la community di chi vive la notte senza filtri. Creiamo le vibes, selezioniamo i locali e portiamo la gente giusta dove la musica picchia forte e succede qualcosa di vero.',
  'Wave Drop è la nostra divisa ufficiale. Streetwear italiano, tirature limitatissime, zero magazzino. Ogni pezzo è pensato per chi fa serata fino all\u2019alba e vuole distinguersi. Niente compromessi, solo roba esclusiva per chi vive la città dopo il tramonto.',
];

export default function AboutPage() {
  return (
    <main className="page-enter container">
      <div className="about">
        <div>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            Chi siamo
          </div>
          <h1 className="about__headline">
            We are
            <br />
            <span className="italic">Wave.</span>
          </h1>
        </div>
        <div className="about__body">
          <p
            style={{
              fontSize: 20,
              color: 'var(--fg)',
              marginBottom: 28,
            }}
          >
            <strong>La notte è la nostra comfort zone.</strong>
          </p>
          {BODY.map((x, i) => (
            <p key={i}>{x}</p>
          ))}
          <div className="stats">
            {STATS.map((s) => (
              <div key={s.k} className="stat">
                <div className="stat__v tnum">{s.v}</div>
                <div className="stat__k">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lookbook">
        <div className="media portrait" data-label="Serata · Lucca" />
        <div
          className="media portrait play"
          data-label="Video · Dietro le quinte"
        />
        <div className="media portrait" data-label="Crew · 2026" />
      </div>
    </main>
  );
}
