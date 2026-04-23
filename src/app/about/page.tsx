export const metadata = { title: 'About' };

const STATS = [
  { v: '006', k: 'Drop usciti' },
  { v: '042', k: 'Serate nel 2025' },
  { v: '12K', k: 'Nella crew' },
  { v: '01', k: 'Città, per ora' },
];

const BODY = [
  'Wave Staff nasce a Lucca come collettivo di persone che credono nella qualità della notte. Oggi siamo il ponte tra chi esce e i locali che meritano: costruiamo serate, selezioniamo i posti, portiamo la gente giusta dove sta succedendo qualcosa di vero.',
  'Wave Drop è la nostra label. Produzione italiana, quantità limitate, nessun magazzino. Ogni capo nasce dalla stessa idea: vestire chi vive davvero questa città dopo il tramonto.',
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
            Siamo
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
            <strong>Un collettivo tra la città e la notte.</strong>
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
