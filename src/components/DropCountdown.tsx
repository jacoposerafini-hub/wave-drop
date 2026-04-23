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
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  if (diff === 0) return null;

  return (
    <div className="flex items-end gap-2 font-display tabular-nums md:gap-3">
      <Box value={d} label="giorni" />
      <Sep />
      <Box value={h} label="ore" />
      <Sep />
      <Box value={m} label="min" />
      <Sep />
      <Box value={s} label="sec" highlight />
    </div>
  );
}

function Box({
  value,
  label,
  highlight,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  const v = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-16 min-w-[64px] items-center justify-center border border-border-strong bg-bg-elevated px-3 md:h-20 md:min-w-[80px] md:px-4">
        <span
          className={`text-5xl leading-none md:text-6xl ${highlight ? 'text-accent' : 'text-white'}`}
        >
          {v}
        </span>
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/40" />
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-ultra text-muted">
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return (
    <span className="pb-7 text-3xl leading-none text-muted md:text-4xl animate-glow-pulse">
      :
    </span>
  );
}
