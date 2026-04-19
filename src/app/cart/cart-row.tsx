'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { removeFromCartAction, updateQtyAction } from '@/app/actions';

interface Props {
  variantId: string;
  qty: number;
  size: string;
  name: string;
  slug: string;
  image?: string;
  priceCents: number;
  lineCents: number;
  expiresAt: number;
}

export default function CartRow(props: Props) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, props.expiresAt - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(Math.max(0, props.expiresAt - Date.now())), 1000);
    return () => clearInterval(id);
  }, [props.expiresAt]);

  const min = Math.floor(timeLeft / 60000);
  const sec = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="flex gap-4 border border-border p-4">
      <Link href={`/product/${props.slug}`} className="shrink-0">
        <div className="relative h-28 w-24 bg-bg-elevated overflow-hidden">
          {props.image && (
            <Image src={props.image} alt={props.name} fill sizes="96px" className="object-cover" />
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/product/${props.slug}`} className="font-semibold hover:text-accent">
              {props.name}
            </Link>
            <button
              onClick={() => start(async () => { await removeFromCartAction(props.variantId); router.refresh(); })}
              aria-label="Rimuovi"
              className="text-muted hover:text-danger"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted">Taglia {props.size}</p>
          {timeLeft < 120000 && timeLeft > 0 && (
            <p className="mt-1 text-[11px] text-danger">
              Riservato: {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center border border-border">
            <button
              onClick={() => start(async () => { await updateQtyAction(props.variantId, props.qty - 1); router.refresh(); })}
              disabled={pending}
              className="flex h-9 w-9 items-center justify-center hover:bg-white/5"
              aria-label="Diminuisci"
            >
              <Minus size={14} />
            </button>
            <span className="flex h-9 min-w-10 items-center justify-center px-2 text-sm tabular-nums">
              {props.qty}
            </span>
            <button
              onClick={() => start(async () => { await updateQtyAction(props.variantId, props.qty + 1); router.refresh(); })}
              disabled={pending}
              className="flex h-9 w-9 items-center justify-center hover:bg-white/5"
              aria-label="Aumenta"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="display text-xl tabular-nums">{formatPrice(props.lineCents)}</p>
        </div>
      </div>
    </div>
  );
}
