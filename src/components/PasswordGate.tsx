'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { verifyDropPassword } from '@/app/actions';
import { cn } from '@/lib/utils';

export default function PasswordGate({ dropSlug }: { dropSlug: string }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(false);
    start(async () => {
      const ok = await verifyDropPassword(dropSlug, pw);
      if (ok) {
        router.refresh();
      } else {
        setErr(true);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-10 px-6">
        <p className="font-display text-6xl md:text-8xl">WAVE</p>
        <form onSubmit={submit} className="flex flex-col items-center gap-4">
          <p className="text-xs uppercase tracking-widest text-muted">Enter password</p>
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            className={cn('input w-72 text-center', err && 'animate-shake border-danger')}
            disabled={pending}
          />
          <button type="submit" className="btn-primary px-6 py-3" disabled={pending}>
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
