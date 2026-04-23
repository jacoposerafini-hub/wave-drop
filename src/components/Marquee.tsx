const MARQUEE_ITEMS = [
  'Drop 007 · live 22:22 cet',
  '★',
  '6 pezzi · limited run',
  '★',
  'niente restock',
  '★',
  'Lucca · Italia',
  '★',
  'spedizione in 48h',
  '★',
];

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee__track">
        <span>
          {MARQUEE_ITEMS.map((x, i) => (
            <span key={i} className={x === '★' ? 'star' : ''}>
              {x}
            </span>
          ))}
        </span>
        <span aria-hidden="true">
          {MARQUEE_ITEMS.map((x, i) => (
            <span key={`dup-${i}`} className={x === '★' ? 'star' : ''}>
              {x}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
