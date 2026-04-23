'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShoppingBag } from 'lucide-react';
import { addToCartAction } from '@/app/actions';
import { cn } from '@/lib/utils';

interface Variant {
  id: string;
  size: string;
  stock: number;
  reserved: number;
}

type MsgType = 'ok' | 'err' | null;

export default function AddToCartButton({ variants }: { variants: Variant[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ text: string; type: MsgType }>({
    text: '',
    type: null,
  });
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const selVariant = variants.find((v) => v.id === selected);
  const available = selVariant ? selVariant.stock - selVariant.reserved : 0;
  const allSoldOut = variants.every((v) => v.stock - v.reserved <= 0);

  function add() {
    if (!selected) {
      setMsg({ text: 'Scegli una taglia', type: 'err' });
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setMsg({ text: '', type: null });
    start(async () => {
      const r = await addToCartAction(selected);
      if (r.ok) {
        setMsg({ text: 'Aggiunto al carrello', type: 'ok' });
        router.refresh();
      } else {
        setMsg({ text: r.error, type: 'err' });
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow">Taglia</p>
          {selVariant && available > 0 && available < 10 && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-danger">
              Left {available}
            </p>
          )}
        </div>
        <div className={cn('flex flex-wrap gap-2', shake && 'animate-shake')}>
          {variants.map((v) => {
            const out = v.stock - v.reserved <= 0;
            const active = selected === v.id;
            return (
              <button
                key={v.id}
                onClick={() => !out && setSelected(v.id)}
                disabled={out}
                className={cn(
                  'h-12 min-w-[56px] px-3 border text-sm font-semibold uppercase tracking-widest transition-all duration-200 ease-smooth',
                  out
                    ? 'border-border text-muted line-through opacity-40 cursor-not-allowed'
                    : active
                      ? 'border-accent bg-accent text-black shadow-glow-soft'
                      : 'border-border-strong hover:border-white/50 hover:bg-white/5',
                )}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={add}
        disabled={pending || allSoldOut}
        className={cn(
          'btn-primary h-14 w-full text-base',
          allSoldOut && 'bg-white/10 text-muted hover:shadow-none',
        )}
      >
        {allSoldOut ? (
          'Sold out'
        ) : pending ? (
          'Aggiunta...'
        ) : (
          <>
            <ShoppingBag size={16} strokeWidth={2} />
            Add to cart
          </>
        )}
      </button>

      {msg.type && (
        <p
          className={cn(
            'flex items-center gap-1.5 text-sm animate-fade-in',
            msg.type === 'ok' ? 'text-success' : 'text-danger',
          )}
        >
          {msg.type === 'ok' && <Check size={14} />}
          {msg.text}
        </p>
      )}
    </div>
  );
}
