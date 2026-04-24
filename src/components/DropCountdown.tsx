'use client';

import { useEffect, useState } from 'react';

export default function DropCountdown({ target }: { target: string | Date }) {
  const targetMs =
    typeof target === 'string' ? new Date(target).getTime() : target.getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, targetMs - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  const cells: Array<[string, string]> = [
    [pad(d), 'GIORNI'],
    [pad(h), 'ORE'],
    [pad(m), 'MIN'],
    [pad(s), 'SEC'],
  ];

  return (
    <div className="countdown">
      <div className="countdown__label">
        <span className="eyebrow">Prossimo drop tra</span>
        <span className="chip live">Live</span>
      </div>
      <div className="countdown__grid">
        {cells.map(([v, u]) => (
          <div key={u} className="countdown__cell">
            <div className="countdown__num tnum">{v}</div>
            <span className="countdown__unit">{u}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
