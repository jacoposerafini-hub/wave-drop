'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { Minus, Plus, Clock } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, props.expiresAt - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(
      () => setTimeLeft(Math.max(0, props.expiresAt - Date.now())),
      1000,
    );
    return () => clearInterval(id);
  }, [props.expiresAt]);

  const min = Math.floor(timeLeft / 60000);
  const sec = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="cart-item">
      <Link href={`/product/${props.slug}`} className="cart-item__img">
        {props.image && (
          <Image
            src={props.image}
            alt={props.name}
            fill
            sizes="80px"
            style={{ objectFit: 'cover' }}
          />
        )}
      </Link>

      <div className="cart-item__body">
        <Link
          href={`/product/${props.slug}`}
          className="cart-item__name"
        >
          {props.name}
        </Link>
        <div className="cart-item__meta">
          Taglia {props.size}
        </div>
        {timeLeft < 120000 && timeLeft > 0 && (
          <div
            className="fade-in"
            style={{
              fontSize: 11,
              color: 'var(--danger)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 4,
            }}
          >
            <Clock size={12} />
            Riservato: {String(min).padStart(2, '0')}:
            {String(sec).padStart(2, '0')}
          </div>
        )}
        <div className="cart-item__qty">
          <button
            onClick={() =>
              start(async () => {
                await updateQtyAction(props.variantId, props.qty - 1);
                router.refresh();
              })
            }
            disabled={pending}
            aria-label="Diminuisci"
          >
            <Minus size={14} />
          </button>
          <span className="tnum">{props.qty}</span>
          <button
            onClick={() =>
              start(async () => {
                await updateQtyAction(props.variantId, props.qty + 1);
                router.refresh();
              })
            }
            disabled={pending}
            aria-label="Aumenta"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="cart-item__right">
        <div className="cart-item__price">
          {formatPrice(props.lineCents)}
        </div>
        <button
          className="cart-item__rem"
          onClick={() =>
            start(async () => {
              await removeFromCartAction(props.variantId);
              router.refresh();
            })
          }
          disabled={pending}
        >
          Rimuovi
        </button>
      </div>
    </div>
  );
}
