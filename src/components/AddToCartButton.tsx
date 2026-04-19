'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addToCartAction } from '@/app/actions';
import { cn } from '@/lib/utils';

interface Variant {
  id: string;
  size: string;
  stock: number;
  reserved: number;
}

export default function AddToCartButton({ variants }: { variants: Variant[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const selVariant = variants.find((v) => v.id === selected);
  const available = selVariant ? selVariant.stock - selVariant.reserved : 0;
  const allSoldOut = variants.every((v) => v.stock - v.reserved <= 0);

  function add() {
    if (!selected) {
      setMsg('Scegli una taglia');
      return;
    }
    setMsg(null);
    start(async () => {
      const r = await addToCartAction(selected);
      if (r.ok) {
        setMsg('✓ Aggiunto al carrello');
        router.refresh();
      } else {
        setMsg(r.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="pill text-muted mb-2">Taglia</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const out = v.stock - v.reserved <= 0;
            const active = selected === v.id;
            return (
              <button
                key={v.id}
                onClick={() => !out && setSelected(v.id)}
                disabled={out}
                className={cn(
                  'h-11 min-w-[52px] px-3 border text-sm font-semibold transition-colors',
                  out
                    ? 'border-border text-muted line-through opacity-40 cursor-not-allowed'
                    : active
                      ? 'border-accent bg-accent text-black'
                      : 'border-border hover:border-white/40',
                )}
              >
                {v.size}
              </button>
            );
          })}
        </div>
        {selVariant && available > 0 && available < 10 && (
          <p className="mt-2 text-xs text-danger">Left {available}</p>
        )}
      </div>

      <button
        onClick={add}
        disabled={pending || allSoldOut}
        className={cn('btn-primary h-14 text-base w-full', allSoldOut && 'bg-white/10 text-muted')}
      >
        {allSoldOut ? 'Sold out' : pending ? 'Aggiunta...' : 'Add to cart'}
      </button>

      {msg && <p className="text-sm text-accent">{msg}</p>}
    </div>
  );
}
