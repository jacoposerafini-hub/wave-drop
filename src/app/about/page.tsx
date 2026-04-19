export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-20 md:py-32">
      <p className="pill text-muted">About</p>
      <h1 className="display mt-4 text-[14vw] md:text-[8vw] leading-[0.9]">
        SIAMO<br />WAVE.
      </h1>

      <div className="mt-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6 md:col-start-1">
          <p className="text-xl leading-relaxed text-white/85">
            Non ti facciamo entrare. Ti facciamo vivere la notte.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Wave Staff nasce a Lucca come collettivo di persone che non sopportavano
            più di uscire alla cieca. Oggi siamo il filtro tra te e la nightlife della
            città. Portiamo gente nei posti giusti, costruiamo serate con i locali che
            meritano, e ora anche vestiamo chi fa parte del mondo.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Wave Drop è la nostra label. Drop limitati. Produzione vera. Niente restock.
            Niente magazzini pieni di invenduto. Quello che fai uscire lo indossi o lo perdi.
          </p>
        </div>
      </div>
    </div>
  );
}
