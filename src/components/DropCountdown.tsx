'use client';

import { useEffect, useState } from 'react';

export default function DropCountdown({ target }: { target: string | Date }) {
  const targetMs = typeof target === 'string' ? new Date(target).getTime() : target.getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, targetMs - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  if (diff === 0) return null;

  return (
    <div className="flex items-end gap-3 font-display tabular-nums">
      <Box value={d} label="giorni" />
      <Sep />
      <Box value={h} label="ore" />
      <Sep />
      <Box value={m} label="min" />
      <Sep />
      <Box value={s} label="sec" />
    </div>
  );
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl md:text-6xl leading-none">{String(value).padStart(2, '0')}</span>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-muted">{label}</span>
    </div>
  );
}

function Sep() {
  return <span className="text-5xl md:text-6xl leading-none text-muted">:</span>;
}
