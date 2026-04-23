'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { verifyDropPassword } from '@/app/actions';

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
    <div className="gate">
      <div className="gate__inner">
        <span className="chip">Private drop</span>
        <h1 className="gate__title">
          Wave<span style={{ color: 'var(--accent)' }}>/</span>Drop
        </h1>
        <form
          onSubmit={submit}
          style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}
        >
          <div className="eyebrow" style={{ textAlign: 'center' }}>
            Inserisci password
          </div>
          <div className={'signup' + (err ? ' shake' : '')}>
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
              type="password"
              placeholder="••••••••"
              disabled={pending}
              style={{ textAlign: 'center', letterSpacing: '0.3em' }}
            />
            <button type="submit" disabled={pending}>
              {pending ? '...' : 'Entra'}
            </button>
          </div>
          {err && (
            <p
              style={{
                color: 'var(--danger)',
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              Password errata. Riprova.
            </p>
          )}
          <button
            type="submit"
            className="btn primary"
            disabled={pending}
            style={{ marginTop: 4 }}
          >
            {pending ? 'Apertura...' : 'Sblocca'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
