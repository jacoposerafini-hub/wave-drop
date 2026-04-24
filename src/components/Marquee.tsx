const MARQUEE_ITEMS = [
  'SOLO 6 PEZZI',
  '◆',
  'ZERO RESTOCK',
  '◆',
  'BORN IN LUCCA',
  '◆',
  'SPEDIZIONE 48H',
  '◆',
  'DROP 007 LIVE 22:22 CET',
  '◆',
];

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee__track">
        <span>
          {MARQUEE_ITEMS.map((x, i) => (
            <span key={i} className={x === '◆' ? 'star' : ''}>
              {x}
            </span>
          ))}
        </span>
        <span aria-hidden="true">
          {MARQUEE_ITEMS.map((x, i) => (
            <span key={`dup-${i}`} className={x === '◆' ? 'star' : ''}>
              {x}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
