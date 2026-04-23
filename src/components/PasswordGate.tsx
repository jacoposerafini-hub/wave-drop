'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      {/* Ambient glow */}
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-pink/10 blur-[120px]" />

      <div className="relative flex flex-col items-center gap-10 px-6 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <span className="pill bg-white/5 text-muted backdrop-blur-sm">
            <Lock size={10} /> Private drop
          </span>
          <p className="font-display text-7xl md:text-9xl">WAVE</p>
        </div>

        <form onSubmit={submit} className="flex flex-col items-center gap-4">
          <p className="eyebrow">Enter password</p>
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            type="password"
            className={cn(
              'input w-72 text-center tracking-[0.3em]',
              err && 'animate-shake border-danger',
            )}
            disabled={pending}
          />
          <button
            type="submit"
            className="btn-primary h-12 px-8"
            disabled={pending}
          >
            {pending ? 'Unlocking...' : 'Unlock'}
            {!pending && <ArrowRight size={14} strokeWidth={2.5} />}
          </button>
          {err && (
            <p className="text-xs text-danger animate-fade-in">
              Password errata. Riprova.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
